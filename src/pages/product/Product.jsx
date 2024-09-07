import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';

export default function Product() {
    const [formData, setFormData] = useState({
        codigo: '',
        nome: '',
        valorVenda: ''
    });

    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null); // Estado para edição

    const navigate = useNavigate();

    // Função fetchProducts movida para fora do useEffect
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/produtos');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Erro ao buscar produtos');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Verificar se todos os campos obrigatórios estão preenchidos
        if (!formData.codigo || !formData.nome || !formData.valorVenda) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
    
        const url = editingProductId
            ? `http://localhost:3001/api/produtos/${editingProductId}`
            : 'http://localhost:3001/api/produtos';
        const method = editingProductId ? 'PUT' : 'POST';
    
        try {
            // Converte o valor de 'valorVenda' de vírgula para ponto
            const valorVendaConvertido = formData.valorVenda.replace(',', '.');
            console.log('Valor Venda Convertido:', valorVendaConvertido); // Log do valor convertido
    
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData.codigo,
                    nome: formData.nome,
                    preco: valorVendaConvertido
                }),
            });
    
            if (response.ok) {
                setFormData({
                    codigo: '',
                    nome: '',
                    valorVenda: ''
                });
                setEditingProductId(null);
                fetchProducts();
            } else {
                console.error('Erro ao salvar produto:', response);
                alert('Erro ao salvar produto');
            }
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert('Erro ao salvar produto');
        }
    }

    const handleEdit = (product) => {
        setFormData({
            codigo: product.id,
            nome: product.nome,
            valorVenda: product.valorVenda
        });
        setEditingProductId(product.id);
    }

    const handleDelete = async (id) => {
        if (window.confirm('Deseja realmente excluir este produto?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/produtos/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    fetchProducts();
                } else {
                    console.error('Erro ao excluir produto:', response);
                    alert('Erro ao excluir produto');
                }
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
                alert('Erro ao excluir produto');
            }
        }
    }

    const handleCancel = () => {
        setFormData({
            codigo: '',
            nome: '',
            valorVenda: ''
        });
        setEditingProductId(null);
        navigate('/produtos');
    }

    return (
        <Card>
            <h1>Cadastro de Produto</h1>
            <div className="card">
                <TabView>
                    <TabPanel header="Lista">
                        <div className="grid">
                            {products.map(products => (
                                <div key={products.id} className="col-12 md:col-6 lg:col-4">
                                    <Card title={products.nome}>
                                        <p><strong>Código:</strong> {products.id}</p>
                                        <p><strong>Valor Venda:</strong> {products.preco}</p>
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-warning"
                                            onClick={() => handleEdit(products)}
                                        />
                                        <Button 
                                            icon="pi pi-trash" 
                                            className="p-button-danger" 
                                            onClick={() => handleDelete(products.id)}
                                            style={{ marginLeft: '10px' }}
                                        />
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                    <TabPanel header={editingProductId ? "Editar" : "Incluir"} leftIcon="pi pi-map-marker mr-2">
                        <form onSubmit={handleSubmit}>
                            <div className="formgrid grid mb-4">
                                <div className="col-12 md:col-6 lg:col-2">
                                    <FloatLabel>
                                        <InputText
                                            name="codigo"
                                            id="codigo"
                                            value={formData.codigo}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                            disabled={editingProductId !== null} // Desabilitar o campo "Código" ao editar
                                        />
                                        <label htmlFor="codigo">Código</label>
                                    </FloatLabel>
                                </div>
                                <div className="col-12 md:col-6 lg:col-6">
                                    <FloatLabel>
                                        <InputText
                                            name="nome"
                                            id="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="nome">Nome do Produto</label>
                                    </FloatLabel>
                                </div>
                                <div className="col-12 md:col-6 lg:col-2">
                                    <FloatLabel>
                                        <InputText
                                            name="valorVenda"
                                            id="valorVenda"
                                            value={formData.valorVenda}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="valorVenda">Valor Venda</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div className="card flex flex-wrap justify-content-left gap-3">
                                <Button type="submit" label="Confirmar" severity="success" icon="pi pi-verified" />
                                <Button
                                    icon="pi pi-times-circle"
                                    type="button"
                                    label="Cancelar"
                                    severity="danger"
                                    onClick={handleCancel}
                                />
                            </div>
                        </form>
                    </TabPanel>
                </TabView>
            </div>
        </Card>
    );
}