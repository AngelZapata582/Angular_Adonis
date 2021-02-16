'use strict'
const products= use('App/Models/Producto')
const coments= use('App/Models/Comentario')
const Database = use('Database')

class ProductoController {
    //Crud para articulos-productos
    async Insertar({request, response, auth}) {
        
        const rules ={
            Nombre: 'required',
            Caducidad: 'required',
        }             
        const data = request.only(['Nombre','Caducidad'])
        const producto=new products()
        producto.Nombre=data.Nombre
        producto.Caducidad=data.Caducidad
        producto.User_id=auth.user.id
        await producto.save()
        return response.json({
            "Se ha agregado un nuevo producto con sus datos:" : producto,
            "user":auth.user
        })
    }

        async Actualizar({request, response, params}){
        const data = request.only(['Nombre','Caducidad'])
        const producto=await products.find(params.id)
        producto.Nombre=data.Nombre
        producto.Caducidad=data.Caducidad
        await producto.save()
        return response.json({"producto":producto,"params":params})
    }

    async Mostrar({response,params}){
        //Mostrar Productos con todos sus comentarios
        //---const product= await products.find(params.id)
        //const comentarios= await producto.comentario().fetch()
        //---const comentarios= await product.comentario().fetch()
        const comentarios = await Database.select('comentarios.comentario','comentarios.id','users.Nombre')
                                          .from('productos').where('productos.id',params.id)
                                          .innerJoin('comentarios','comentarios.producto_id','productos.id')
                                          .innerJoin('users','users.id','comentarios.user_id')
        return  response.json(comentarios)

    }
    
    async show({request,params, response}){
        if (params.id == null){
            const product= await products.all()
            return response.json({"Productos":product})
        }else{
            const product= await products.find(params.id)
            return response.json({"Productos":product})
        }
    }
}

module.exports = ProductoController
