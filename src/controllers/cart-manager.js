const fs = require("fs") .promises;

class CartManager {
    constructor(path){
        this.carts = [];
        this.path = path;
        this.ultId = 0;

        this.cargarCarritos();
    }

    async cargarCarritos(){
        try {
            const data = await fs.readFile(this.path, "uft8");
            this.carts = JSON.parse(data);
            if(this.carts.length > 0){
                this.ultId = Math.max(...this.carts.map(cart => cart.id))
            }
        } catch (error) {
            console.log("Error al cargar los carritos desde el archivo", error);
            await this.guardarCarritos();
        }
    }

    async guardarCarritos(){
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async crearCarrito(){
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };

        this.carts.push(nuevoCarrito);

        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async getCartsById(cartId){
        try {
            const carrito = this.carts.find(c => c.id === cartId);

            if(!carrito){
                throw new Error()
            }
        } catch (error) {
            console.log("Error al buscar el carrito", error);
        }        
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1){
        const carrito = await this.getCartsById(cartId);
        const existeProducto = carrito.products.find(p => p.product === productId);

        if (existeProducto){
            existeProducto.quantity += quantity;
        } else{
            carrito.product.push({product: productId, quantity});
        }

        await this.guardarCarritos();
        return carrito;
    }
}

module.exports = CartManager;