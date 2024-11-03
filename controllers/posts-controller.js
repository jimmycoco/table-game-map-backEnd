const HttpError = require("../models/http-error");
const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res, next) => {
  try {
    const { title, tags, content , coverImage, authorId } = req.body;

    console.log(req.body);

    if (!title || title.trim() === "") {
      return next(new HttpError("Title is required", 400));
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return next(
        new HttpError("Tags should be an array and cannot be empty", 400)
      );
    }

    if (!content || content.trim() === "") {
      return next(new HttpError("Content is required", 400));
    }

    if (!authorId || authorId.trim() === "") {
      return next(new HttpError("AuthorId is required", 400));
    }

    const user = await User.findById(authorId);

    if (!user) {
      return next(new HttpError("User not found", 400)); 
    }

    const post = new Post({
      title,
      tags,
      content,
      coverImage,
      author: authorId,
    });

    await post.save();

    next(res.status(201).json(post));
  } catch (error) {
    console.log(req.body);
    next(new HttpError("Server error", 500));
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).populate('author', 'fullName profileImage _id');
    console.log(post);

    if (!post) return next(new HttpError("Post not found", 404));
    
    res.json(post);

  } catch (error) {
    next(new HttpError("Server error", 500));
  }
};

exports.getAllPost = async (req, res, next) => {
  try {
    const { tag, title, top } = req.query;

    let queryObj = {};

    if (tag) {
      queryObj.tags = { $regex: new RegExp(tag, "i") };
    }

    if (title) {
      queryObj.title = new RegExp(title, "i"); // 使用正規表達式進行模糊搜尋
    }

    let limitAmount = top ? parseInt(top) : 10;

    // 在查詢中使用.sort() 和.limit() 
    const posts = await Post.find(queryObj)
      .populate('author', 'fullName profileImage _id')
      .sort({ createdAt: -1 })  
      .limit(limitAmount); 

    res.json(posts);
  } catch (err) {
    next(new HttpError("Server error", 500));
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params; 

    if (!postId) {
      return next(new HttpError("PostId is required", 400));
    }

    const { title, tags, content, coverImage, authorId } = req.body;

    // 檢查文章是否存在
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    // 更新文章資料
    if (title && title.trim() !== "") {
      post.title = title;
    }

    if (tags && Array.isArray(tags) && tags.length !== 0) {
      post.tags = tags;
    }

    if (content && content.trim() !== "") {
      post.content = content;
    }

    if (coverImage) {
      post.coverImage = coverImage;
    }

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    next(new HttpError("Server error", 500));
  }
};


exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return next(new HttpError("Post not found", 404));

    await post.deleteOne();

    res.json({ msg: "Post removed" });
  } catch (error) {
    next(new HttpError("Server error", 500));
  }
};

exports.getPostsByTag = async (req, res, next) => {
  try {
    const { tag } = req.query;

    // Create an empty aggregation pipeline
    const aggregationPipeline = [];

    // Check if tag exists and is not null
    if (tag) {
      // Create a regular expression for a case-insensitive fuzzy search
      const tagRegex = new RegExp(tag, 'i');

      // Add the $match stage to the aggregation pipeline
      aggregationPipeline.push({
        $match: {
          "tags": { $regex: tagRegex }
        },
      });
    }

    // Add the remaining aggregation stages
    aggregationPipeline.push(
      // 使用 $unwind 來擴展 tags 這個陣列
      {
        $unwind: "$tags",
      },
      {
        $lookup: {
          from: "users", // <-- collection to join
          localField: "author", // <-- field from the input documents
          foreignField: "_id", // <-- field from the documents of the "from" collection
          as: "author_info" // <-- output array field
        }
      },

      // 根據 tag 來組合回傳的資料
      {
        $group: {
          _id: "$tags", // 使用 tag 作為群組的 ID
          posts: {
            $push: {
              title: "$title",
              content: "$content",
              tags: "$tags",
              author: { $arrayElemAt: ["$author_info", 0] }, // Using $arrayElemAt to fetch the first element since $lookup returns an array
              createdDate: "$createdDate",
            },
          },
        },
      },
      // 根據文章建立時間排序
      {
        $sort: { "posts.createdDate": -1 },
      },
      // 調整回傳資料
      {
        $project: {
          tag: "$_id",
          posts: 1, // 保留 posts。數字 1 代表該欄位被包含在回傳資料中。
          _id: 0, // 將 _id 從回傳內容中排除。因為每個 MongoDB 文件都會有一個自動生成的 _id，但在這裡我們不希望它出現在回傳的資料中
        },
      }
    );

    // Execute the aggregation pipeline
    const results = await Post.aggregate(aggregationPipeline);

    res.json(results);
   

  } catch (err) {
    next(new HttpError("Server error", 500));
  }
};
