import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';

export default function Sales() {
    const [date, setDate] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [items, setItems] = useState([]);
    const [people, setPeople] = useState([]);
    const [products, setProducts] = useState([]);

    // Carregar pessoas da API
    useEffect(() => {
        fetch('http://localhost:3001/api/pessoas')
            .then(response => response.json())
            .then(data => setPeople(data))
            .catch(error => console.error('Erro ao buscar pessoas:', error));
    }, []);

    // Carregar produtos da API
    useEffect(() => {
        fetch('http://localhost:3001/api/produtos')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Erro ao buscar produtos:', error));
    }, []);

    // Adiciona um item à lista de itens
    const addItem = () => {
        if (!selectedProduct || !quantity || !unitPrice) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const productPrice = parseFloat(selectedProduct.preco);
        const quantityValue = parseFloat(quantity);
        const unitPriceValue = parseFloat(unitPrice);
        const newItem = {
            produto: selectedProduct,
            quantidade: quantityValue,
            valorUnitario: unitPriceValue,
            valorItem: quantityValue * unitPriceValue,
        };

        setItems([...items, newItem]);
        setSelectedProduct(null);
        setQuantity('');
        setUnitPrice('');
    };

    // Calcula o total da venda
    const getTotal = () => {
        return items.reduce((total, item) => total + item.valorItem, 0).toFixed(2);
    };

    return (
        <Card>
            <h1>Venda</h1>
            <div className="card">
                <TabView>
                    <TabPanel header="Lista">
                        {/* Conteúdo da aba "Lista" */}
                    </TabPanel>
                    <TabPanel header="Incluir" leftIcon="pi pi-shopping-bag mr-2">
                        <div className="formgrid grid mb-4">
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="codigo" id="codigo" style={{ width: '100%' }} />
                                    <label htmlFor="codigo">Código</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <Calendar name="data-venda" id="data-venda" value={date} onChange={(e) => setDate(e.value)} style={{ width: '100%' }} />
                                    <label htmlFor="data-venda">Data Venda</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <Dropdown name="pessoa" id="pessoa" value={selectedPerson} onChange={(e) => setSelectedPerson(e.value)} 
                                        options={people} optionLabel="nome" placeholder="Selecione a pessoa" className="w-full" />
                                    <label htmlFor="pessoa">Pessoa</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div className="formgrid grid mb-4">
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <Dropdown name="produto" id="produto" value={selectedProduct} onChange={(e) => {
                                        setSelectedProduct(e.value);
                                        setUnitPrice(e.value.preco);
                                    }} 
                                        options={products} optionLabel="nome" placeholder="Selecione o produto" className="w-full" />
                                    <label htmlFor="produto">Produto</label>
                                </FloatLabel>
                            </div>
                            <div className="mx-4 col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="qtde-venda" id="qtde-venda" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{ width: '100%' }} />
                                    <label htmlFor="qtde-venda">Qtde Venda</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="vr-unitario" id="vr-unitario" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} style={{ width: '100%' }} />
                                    <label htmlFor="vr-unitario">Vr. Unitário</label>
                                </FloatLabel>
                            </div>
                            <div className='col-12 md:col-6 lg:col-2'>
                                <Button icon="pi pi-cart-plus" severity='secondary' outlined onClick={addItem} />
                            </div>
                        </div>
                        <div className="col-12">
                            <h3>Itens de Venda</h3>
                            <table className="p-datatable p-datatable-responsive p-table p-component">
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Quantidade</th>
                                        <th>Valor Unitário</th>
                                        <th>Valor Item</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.produto.nome}</td>
                                            <td>{item.quantidade}</td>
                                            <td>{item.valorUnitario.toFixed(2)}</td>
                                            <td>{item.valorItem.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-content-end mt-4">
                                <h3>Total: {getTotal()}</h3>
                            </div>
                        </div>
                        <div className="card flex flex-wrap justify-content-left gap-3 mt-4">
                            <Button label="Confirmar" severity="success" />
                            <Button label="Cancelar" severity="danger" />
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </Card>
    );
}
