import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => (
    <div className="flex items-center justify-between py-4 border-b">
        <div className="flex items-center gap-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
            <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-gray-500">${item.price.toFixed(2)}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <input
                type="number"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                className="w-16 text-center border rounded"
                min="1"
            />
            <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700">&times;</button>
        </div>
    </div>
);

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-30 flex flex-col`}>
            <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button onClick={onClose} className="text-2xl">&times;</button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto">
                {cartItems.length === 0 ? (
                    <p className="text-gray-500">Your cart is empty.</p>
                ) : (
                    cartItems.map(item => (
                        <CartItem key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemoveItem={onRemoveItem} />
                    ))
                )}
            </div>
            {cartItems.length > 0 && (
                <div className="p-6 border-t bg-gray-50">
                    <div className="flex justify-between font-bold text-lg mb-4">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={onCheckout}
                        className="w-full bg-brand text-white font-bold py-3 rounded-lg hover:bg-brand-dark transition-colors"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;