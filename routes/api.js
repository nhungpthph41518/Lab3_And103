var express = require("express");
var router = express.Router();

//
const Distributors = require("../models/distributors");
const Fruits = require("../models/fruits");

//api thêm distributor
router.post("/add-distributor", async (req, res) => {
  try {
    const data = req.body;
    const newDistributors = new Distributors({
      name: data.name,
    });
    const result = await newDistributors.save();
    if (result) {
      res.json({
        status: 200,
        messenger: "Thêm thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "Lỗi, thêm không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//api thêm fruit

router.post("/add-fruit", async (req, res) => {
  try {
    const data = req.body;
    const newfruit = new Fruits({
      name: data.name,
      quantity: data.quantity,
      price: data.price,
      status: data.status,
      image: data.image,
      description: data.description,
      id_distributor: data.id_distributor,
    });
    const result = await newfruit.save();
    if (result) {
      res.json({
        status: 200,
        messenger: "Thêm thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        messenger: "Lỗi, thêm không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//get danh sách fruit
router.get("/get-list-fruit", async (req, res) => {
  try {
    const data = await Fruits.find().populate("id_distributor");
    res.json({
      status: 200,
      messenger: "Danh sách fruit",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

//*Get chi tiết Fruits (truyền param id)

router.get("/get-fruit-by-id/:id", async (req, res) => {
  //id param
  try {
    const { id } = req.params;
    const data = await Fruits.findById(id).populate("id_distributor");
    res.json({
      status: 200,
      messenger: "Danh sách fruit",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

// *Get danh sách Fruits (danh sách trả về gồm: name, quantity, price, id_ditributor)
// nằm trong khoảng giá (query giá cao nhất, giá thấp nhất) và sắp xếp theo
// quantity (giảm dần)
router.get("/get-list-fruit-in-price", async (req, res) => {
  try {
    const { price_start, price_end } = req.query;
    const query = { price: { $gte: price_start, $lte: price_end } };
    const data = await Fruits.find(query, "name quantity price id_distributor")
      .populate("id_distributor")
      .sort({ quantity: -1 })
      .skip(0)
      .limit(2);

    res.json({
      status: 200,
      message: "Danh sách fruit",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

// *Get danh sách Fruits (danh sách trả về gồm: name, quantity, price, id_ditributor)
// có chữ cái bắt đầu tên là A hoặc X

router.get("/get-list-fruit-have-name-a-or-x", async (req, res) => {
  try {
    const query = {
      $or: [{ name: { $regex: "T" } }, { name: { $regex: "X" } }],
    };

    const data = await Fruits.find(
      query,
      "name quantity price id_distributor"
    ).populate("id_distributor");

    res.json({
      status: 200,
      messenger: "Danh sách fruit",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
});

//cap nhat fruit

router.put("/update-fruit-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updateFruit = await Fruits.findById(id);
    let result = null;
    if (updateFruit) {
      updateFruit.name = data.name ?? updateFruit.name;
      updateFruit.quantity = data.quantity ?? updateFruit.quantity;
      updateFruit.price = data.price ?? updateFruit.price;
      updateFruit.status = data.status ?? updateFruit.status;
      updateFruit.image = data.image ?? updateFruit.image;
      updateFruit.description = data.description ?? updateFruit.description;
      updateFruit.id_distributor =
        data.id_distributor ?? updateFruit.id_distributor;
      result = await updateFruit.save();
    }
    if (result) {
      res.json({
        status: 200,
        message: "Cập nhật thành công",
        data: result,
      });
    } else {
      res.json({
        status: 400,
        message: "Lỗi khi cập nhật trái cây",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
