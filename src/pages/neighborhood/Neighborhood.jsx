import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';

export default function Bairro() {
    const [formData, setFormData] = useState({
        codigo: '',
        bairro: '',
    });

    const [bairros, setBairros] = useState([]); // Estado para armazenar os bairros
    const [editingId, setEditingId] = useState(null); // Estado para armazenar o ID do bairro em edição

    const navigate = useNavigate();

    const fetchBairros = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/bairros');
            const data = await response.json();
            setBairros(data);
        } catch (error) {
            console.error('Erro ao buscar bairros:', error);
        }
    };

    useEffect(() => {
        fetchBairros();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId 
            ? `http://localhost:3001/api/bairros/${editingId}` 
            : 'http://localhost:3001/api/bairros';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData.codigo,
                    nome: formData.bairro,
                }),
            });

            if (response.ok) {
                alert(editingId ? 'Bairro atualizado com sucesso!' : 'Bairro adicionado com sucesso!');
                setFormData({ codigo: '', bairro: '' });
                setEditingId(null);
                fetchBairros(); // Atualiza a lista após adição ou edição
            } else {
                alert('Erro ao processar a solicitação.');
            }
        } catch (error) {
            console.error('Erro ao processar a solicitação:', error);
            alert('Erro ao processar a solicitação');
        }
    };

    const handleEdit = (bairro) => {
        setFormData({
            codigo: bairro.id,
            bairro: bairro.nome,
        });
        setEditingId(bairro.id);
    };

    const handleDelete = async (bairroId) => {
        if (window.confirm('Tem certeza que deseja deletar este bairro?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/bairros/${bairroId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Bairro deletado com sucesso!');
                    setBairros(prevBairros => prevBairros.filter(bairro => bairro.id !== bairroId));
                } else {
                    alert('Erro ao deletar bairro');
                }
            } catch (error) {
                console.error('Erro ao deletar bairro:', error);
                alert('Erro ao deletar bairro');
            }
        }
    };

    const handleCancel = () => {
        setFormData({ codigo: '', bairro: '' });
        setEditingId(null);
        navigate('/');
    };

    return (
        <Card>
            <h1>Cadastro de Bairro</h1>
            <div className="card">
                <TabView>
                    <TabPanel header="Lista">
                        <div className="grid">
                            {bairros.map(bairro => (
                                <div key={bairro.id} className="col-12 md:col-6 lg:col-4">
                                    <Card title={bairro.nome}>
                                        <p><strong>Código:</strong> {bairro.id}</p>
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-warning"
                                            onClick={() => handleEdit(bairro)}
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-danger"
                                            onClick={() => handleDelete(bairro.id)}
                                            style={{ marginLeft: '10px' }}
                                        />
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                    <TabPanel header={editingId ? "Editar" : "Incluir"} leftIcon="pi pi-map-marker mr-2">
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
                                            disabled={editingId !== null}
                                        />
                                        <label htmlFor="codigo">Código</label>
                                    </FloatLabel>
                                </div>
                                <div className="col-12 md:col-6 lg:col-6">
                                    <FloatLabel>
                                        <InputText
                                            name="bairro"
                                            id="bairro"
                                            value={formData.bairro}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="bairro">Bairro</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div className="card flex flex-wrap justify-content-left gap-3">
                                <Button type="submit" label={editingId ? 'Atualizar' : 'Confirmar'} severity="success" icon="pi pi-verified"/>
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
