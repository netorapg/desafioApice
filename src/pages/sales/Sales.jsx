import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
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
    const [editingID, setEditingID] = useState(null);
    const [sales, setSales] = useState([]);

    const [formData, setFormData] = useState({
        codigo: '',
        dataVenda: '',
        pessoa: '',
        itens: [],
    });

    const navigate = useNavigate();

    // Função para buscar vendas
    const fetchSales = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/vendas');
            const text = await response.text();
            console.log('Resposta recebida:', text);
            const data = JSON.parse(text);

            if (!Array.isArray(data)) {
                throw new Error('Resposta da API não é um array');
            }

            const salesWithItems = await Promise.all(data.map(async sale => {
                const itemsResponse = await fetch(`http://localhost:3001/api/venda_itens/${sale.id}`);
                const itemsText = await itemsResponse.text();
                console.log('Itens recebidos:', itemsText);
                const itemsData = JSON.parse(itemsText);
                return { ...sale, itens: itemsData };
            }));
            setSales(salesWithItems);
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
        }
    };



    // Função para buscar pessoas
    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/pessoas');
                const data = await response.json();
                setPeople(data);
            } catch (error) {
                console.error('Erro ao buscar pessoas:', error);
            }
        };
        fetchPeople();
    }, []);

    // Função para buscar produtos
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/produtos');
                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error('Resposta da API de produtos não é um array');
                }

                setProducts(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchProducts();
    }, []);

    // Carregar vendas ao montar o componente
    useEffect(() => {
        fetchSales();
    }, []);

    // Adicionar um item à venda
    const addItem = () => {
        if (!selectedProduct || !quantity || !unitPrice) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const quantityValue = parseFloat(quantity);
        const unitPriceValue = parseFloat(unitPrice);
        const newItem = {
            produto: selectedProduct,
            quantidade: quantityValue,
            valorUnitario: Number(unitPriceValue.toFixed(2)),
            valorItem: quantityValue * unitPriceValue,
        };

        setItems([...items, newItem]);
        setSelectedProduct(null);
        setQuantity('');
        setUnitPrice('');
    };

    // Calcula o total da venda
    const getTotal = () => items.reduce((total, item) => total + item.valorItem, 0).toFixed(2);

    // Atualiza dados do formulário
    // Atualiza dados do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleEditItem = (index) => {
        const itemToEdit = items[index];
        setSelectedProduct(itemToEdit.produto);
        setQuantity(itemToEdit.quantidade);
        setUnitPrice(itemToEdit.valorUnitario);
        setItems(items.filter((_, i) => i !== index));
    }

    const handleDeleteItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    }


    // Envia dados do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (items.length === 0) {
            alert('Por favor, adicione pelo menos um item à venda.');
            return;
        }

        const method = editingID ? 'PUT' : 'POST';
        const url = editingID ? `http://localhost:3001/api/vendas/${editingID}` : 'http://localhost:3001/api/vendas';

        const formattedDate = date ? date.toISOString().split('T')[0] : null;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData.codigo,
                    dt_venda: formattedDate,
                    pessoa_id: selectedPerson ? selectedPerson.id : null,
                }),
            });

            if (response.ok) {
                const venda = await response.json();
                const vendaId = venda.id;

                // Salvar itens da venda
                const itemResponses = await Promise.all(items.map(item => {
                    return fetch('http://localhost:3001/api/venda_itens', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            venda_id: vendaId,
                            produto_id: item.produto.id,
                            qtde: item.quantidade,
                            vr_venda: item.valorUnitario,
                        }),
                    });
                }));

                const allItemsSaved = itemResponses.every(res => res.ok);

                if (allItemsSaved) {
                    alert(editingID ? 'Venda atualizada com sucesso!' : 'Venda cadastrada com sucesso!');
                    setFormData({
                        codigo: '',
                        dataVenda: '',
                        pessoa: '',
                        itens: [],
                    });
                    setDate(null);
                    setEditingID(null);
                    fetchSales();
                } else {
                    console.error('Erro ao salvar itens da venda.');
                }
            } else {
                console.error('Erro ao salvar venda.');
            }
        } catch (error) {
            console.error('Erro ao salvar venda:', error);
        }
    };




    // Cancela a operação e navega para outra página
    const handleCancel = () => {
        setFormData({
            codigo: '',
            dataVenda: '',
            pessoa: '',
            itens: [],
        });
        setEditingID(null);
        navigate('/');
    };

    // Edita uma venda existente
    const handleEdit = (id) => {
        const saleToEdit = sales.find(sale => sale.id === id);
        if (saleToEdit) {
            setFormData({
                codigo: saleToEdit.id,
                dataVenda: saleToEdit.dt_venda,
                pessoa: saleToEdit.pessoa_id,
                itens: saleToEdit.itens.map(item => ({
                    ...item,
                    valorUnitario: Number(item.valorUnitario).toFixed(2) // Garantir que valorUnitario é um número
                })),
            });
            setEditingID(id);
        }
    };

    // Deleta uma venda
    const handleDelete = async (id) => {
        if (window.confirm('Deseja realmente excluir esta venda?')) {
            try {
                // Buscar itens da venda
                const itemsResponse = await fetch(`http://localhost:3001/api/venda_itens?venda_id=${id}`);
                if (!itemsResponse.ok) {
                    console.error('Erro ao buscar itens da venda.');
                    return;
                }
                const items = await itemsResponse.json();

                // Excluir itens da venda
                const deleteItemPromises = items.map(item => {
                    return fetch(`http://localhost:3001/api/venda_itens/${item.id}`, {
                        method: 'DELETE',
                    });
                });

                const itemResponses = await Promise.all(deleteItemPromises);
                const allItemsDeleted = itemResponses.every(response => response.ok);

                if (!allItemsDeleted) {
                    console.error('Erro ao excluir alguns itens da venda.');
                    return;
                }

                // Excluir a venda
                const response = await fetch(`http://localhost:3001/api/vendas/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Venda excluída com sucesso!');
                    fetchSales(); // Atualizar a lista de vendas
                } else {
                    console.error('Erro ao excluir venda.');
                }
            } catch (error) {
                console.error('Erro ao excluir venda:', error);
            }
        }
    };

    return (
        <Card>
            <h1>Venda</h1>
            <div className="card">
                <TabView>
                    <TabPanel header="Lista">
                        <div className='grid'>
                            {sales.map(sale => (
                                <div key={sale.id} className="col-12 md:col-6 lg:col-3">
                                    <Card title={sale.id} subTitle={sale.dt_venda}>
                                        <p><strong>Código:</strong> {sale.id}</p>
                                        <p><strong>Pessoa:</strong> {people.find(p => p.id === sale.pessoa_id)?.nome || 'Desconhecido'}</p>

                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-rounded p-button-secondary"
                                            onClick={() => handleEdit(sale)}
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-danger"
                                            onClick={() => handleDelete(sale.id)}
                                        />
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                    <TabPanel header="Incluir" leftIcon="pi pi-shopping-bag mr-2">
                        <div className="formgrid grid mb-4">
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="codigo" id="codigo" value={formData.codigo} onChange={handleChange} style={{ width: '100%' }} />
                                    <label htmlFor="codigo">Código</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <Calendar name="dataVenda" id="dataVenda" value={date} onChange={(e) => setDate(e.value)} style={{ width: '100%' }} />
                                    <label htmlFor="dataVenda">Data Venda</label>
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
                                    <InputText name="quantidade" id="quantidade" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{ width: '100%' }} />
                                    <label htmlFor="quantidade">Qtde Venda</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="valorUnitario" id="valorUnitario" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} style={{ width: '100%' }} />
                                    <label htmlFor="valorUnitario">Vr. Unitário</label>
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

                                            <Button
                                                icon="pi pi-pencil"
                                                className="p-button-rounded p-button-secondary"
                                                onClick={() => handleEditItem(index)}
                                            />
                                            <Button
                                                icon="pi pi-trash"
                                                className="p-button-rounded p-button-danger"
                                                onClick={() => handleDeleteItem(index)} 
                                            />
                                        </tr>
                                    ))}
                                </tbody>


                            </table>
                            <div className="flex justify-content-end mt-4">
                                <h3>Total: {getTotal()}</h3>
                            </div>
                        </div>
                        <div className="card flex flex-wrap justify-content-left gap-3 mt-4">
                            <Button label="Confirmar" severity="success" onClick={handleSubmit} />
                            <Button label="Cancelar" severity="danger" onClick={handleCancel} />
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </Card>
    );
}