const fs = require('fs');
const Sauces = require('../models/Sauces');



// console.log("controller init");


exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce)
  delete saucesObject._id
  const sauces = new Sauces({
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  sauces.save()
  .then(() => {res.status(201).json({message: 'Objet enregistré !'});})
  .catch((error) => {res.status(400).json({message: error})})
};


exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id
  })
  .then((sauces) => {res.status(200).json(sauces);})
  .catch((error) => {res.status(404).json({message: error});});
};

exports.modifySauces = (req, res, next) => {
  const saucesObject = req.file ? {
      ...JSON.parse(req.body.sauces),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete saucesObject._userId;
  Sauces.findOne({_id: req.params.id})
      .then((sauces) => {
          if (sauces.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauces.updateOne({ _id: req.params.id}, { ...saucesObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {res.status(400).json({ error });});
};

exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id})
      .then(sauces => {
          if (sauces.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauces.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauces.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {res.status(500).json({ error });});
};

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
  .then((saucess) => {res.status(200).json(saucess);})
  .catch((error) => {res.status(400).json({error: error});});
};

exports.likeSauces = (req, res, next) => {
  const saucesObject = req.file ? {
    ...JSON.parse(req.body.sauces),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Sauces.findOne({_id: req.params.id})
  .then(sauces => {
      switch (req.body.like) {
          case -1:
              sauces.usersLiked.splice(sauces.usersLiked.indexOf(req.body.userId), 1);
              sauces.usersDisliked.push(req.body.userId);
              sauces.dislikes++;
              break;
          case 0:
              if (sauces.usersLiked.splice(sauces.usersLiked.indexOf(req.body.userId), 1)) {
                sauces.likes--;
              } else {
                sauces.usersLiked.splice(sauces.usersLiked.indexOf(req.body.userId), 1);
                sauces.dislikes--;
              }
              break;
          case 1:
            sauces.usersLiked.splice(sauces.usersLiked.indexOf(req.body.userId), 1);
              sauces.usersLiked.push(req.body.userId);
              sauces.likes++;
              break;
      }
    Sauces.updateOne({ _id: req.params.id}, { ...saucesObject, _id: req.params.id})
    .then(() => res.status(200).json({message : 'Objet modifié!'}))
    .catch(error => res.status(401).json({ error }));
  });
}