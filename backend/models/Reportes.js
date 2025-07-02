 const mongoose =require('mongoose');

const reportsSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, ' El nombre es obligatorio'],
        trim: true,
        unique:true
    },
    description:{
        type: String,
        required:[true,'La descripcion es requerida'],
        trim: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:[true,'La categoria es requerida']
    }

    },{
        timestamps: true,
        versionKey: false
    });
//Manejo de errores de duplicado
reportsSchema.post('save', function(error,doc,next)
{
    if(error.name === 'MongoServerError' && error.code ===11000){
        next(new Error('Ya existe una subcategoria con ese nombre'));
    }else{
        next(error);
    }
});
module.exports = mongoose.model('Repotes', reportsSchema);