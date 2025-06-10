const prisma=require('../../config/prisma');
const detailHost={
    async findById(id){
        try{
            return await prisma.Usuario.findUnique({
                where: {id},
                select:{
                    id:true,
                    nombre:true,
                    fecha_nacimiento:true,
                    genero:true,
                    Ciudad:{
                        select:{
                            nombre:true,
                        }
                    },
                    correo:true,
                    telefono:true,
                    foto:true,
                    Carro:{
                        select:{
                            id:true,
                            modelo:true,
                            marca:true,
                            Imagen : {
                                take: 1,
                                orderBy: {
                                id: 'asc'
                                },
                                select: {
                                    id: true,
                                    data: true,
                                    id_carro: true
                                }
                            },
                        }
                    
                    }
                }
            })
        }catch(error){
            console.log(error);
        }
    }
}
module.exports=detailHost;