const model = require('../models/item');

// GET /trades: get all trade items
exports.readAllTrades = (req,res,next) => {
  // Aggreate the collections and return array of grouped by category
  model.aggregate([
    {
      $group: {
        _id: '$itemCategory',
        items: { $push: '$$ROOT' }
      }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        items: 1
      }
    },
    { $sort: { category: 1 } }
  ])
  .then(
    sortedItems => {
      res.render("./trades/index", {sortedItems});
    }
  )
  .catch(err => next(err));

}

// GET /trades/new: redirect to page to create new trade
exports.readNewTrade = (req,res) => {
  res.render('./trades/new');
}

// POST /trades: create new trade
exports.createNewTrade = (req,res,next) => {
  let item = new model(req.body);
  item.owner = req.session.user;
  item.save()
  .then(item => {
    req.flash('success', 'Your trade item has successfully been added');
    res.redirect('/trades');
  })
  .catch(err=>{
    if(err.name === "ValidationError") {
      req.flash('error', 'Item validation failed. Please try again!');  
      res.redirect('back');
      err.status = 400; // Invalid request

    }
    next(err);
  });
}

// GET /trades/id: get a trade item with id
exports.showTradeItem = (req, res, next) => {
  let id = req.params.id;

  model.findById(id).populate('owner', 'firstName lastName')
  .then(item => {
      if(item) {
        res.render('./trades/show', {item});
      } else {
          let err = new Error("Cannot find item with id " + id);
          err.status = 404;
          next(err);
      }
  })
  .catch(err=>next(err));
}

// GET /trades/id/update: redirect to edit page for trade item
exports.readUpdateTradeItem = (req, res, next) =>  {
  let id = req.params.id;
  model.findById(id)
  .then(item => {
    if(item) {
      res.render('./trades/edit', {item});
    } else {
      let err = new Error("Cannot find item with id " + id);
      err.status = 404;
      next(err);
    }
  })
  .catch(err=>next(err))
  
}

// PUT /trades/id: update the trade item
exports.updateTradeItem = (req, res, next) => {
  let id = req.params.id;
  let item = req.body;

  model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators:true})
  .then(item=>{
      if(item) {
        req.flash('success', 'Your trade item has successfully been updated');
        res.redirect("/trades/" + id);
      } else {
        let err = new Error("Cannot find item with id " + id);
        err.status = 404;
        next(err);
      }
  })
  .catch(err=>{
      if(err.name === "ValidationError") {
          err.status=400;
      }
      next(err);
  })

  
}

// DELETE /trades/:id: delete trade item of id
exports.deleteTradeItem = (req, res, next) => {
  let id = req.params.id;
  model.findByIdAndDelete(id, {useFindAndModify: false})
  .then(item =>  {
      if(item) {
          req.flash('success', 'Your trade item has successfully been deleted');
          res.redirect('/trades');
      } else {
        let err = new Error("Cannot find item with id " + id);
        err.status = 404;
        next(err);
      }
  })
  .catch(err => next(err))
}


