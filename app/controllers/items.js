'use strict';

var Item    = require('../models/item'),
    User    = require('../models/user'),
    mp      = require('multiparty');

exports.new = function(req, res){
  res.render('items/new');
};

exports.create = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    console.log('FIELDS in create>>>>>> ', fields);
    console.log('FILES in create>>>>>> ', files);
    Item.create(res.locals.user._id, fields, files, function(){
      res.redirect('/profile');
    });
  });
};

exports.index = function(req, res){
  console.log('THIS IS req.query in exports.index>>>>> ', req.query);
  Item.find({isAvailable:true}, function(err, items){
    User.getLocations(function(err, locations){
      console.log('THIS IS ITEMS', items);
      res.render('items/index', {items:items, locations:locations});
    });
  });
};

exports.show = function(req, res){
  Item.findById(req.params.itemId, function(err, item){
    User.findById(item.ownerId, function(err, client){
      res.render('items/show', {item:item, client:client});
    });
  });
};

exports.newBid = function(req, res){
  Item.findById(req.params.itemId, function(err, item){
    Item.findBids(res.locals.user._id, function(err, bids){
      res.render('items/bid', {item:item, bids:bids});
    });
  });
};

exports.bid = function(req, res){
  Item.findById(req.params.itemId, function(err, forSale){
    Item.findById(req.body.offer, function(err, bidItem){
      forSale.bid(bidItem, function(){
        res.redirect('/items/' + req.params.itemId);
      });
    });
  });
};

exports.edit = function(req, res){
  Item.findById(req.params.itemId, function(err, item){
    res.render('items/edit', {item:item});
  });
};

exports.update = function(req, res){
  var form = new mp.Form();
  form.parse(req, function(err, fields, files){
    Item.findById(req.params.itemId, function(err, item){
      item.update(fields, files, function(err, cb){
        res.redirect('/profile');
      });
    });
  });
};

exports.offers = function(req, res){
  Item.findOffers(res.locals.user._id, function(err, offers){
    console.log('pending offers >>>>>>>>', offers);
    res.render('items/offers', {offers:offers});
  });
};

exports.accept = function(req, res){
  Item.findById(req.params.itemId, function(err, saleItem){
    Item.findById(req.params.bidId, function(err, bidItem){
      saleItem.accept(bidItem, function(err, cb){
        res.redirect('/profile');
      });
    });
  });
};

exports.reject = function(req, res){
  //res.locals.user.reject(req.params.itemId, req.params.bidId, function(){
  res.redirect('/offers');
  //});
};
