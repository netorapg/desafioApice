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

    const [neighborhoods, setNeighborhoods] = useState([]); // Estado para armazenar os bairros

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch neighborhoods from the backend
        const fetchNeighborhoods = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/bairros');
                const data = await response.json();
                setNeighborhoods(data);
            } catch (error) {
                console.error('Error fetching neighborhoods:', error);
            }
        };

        fetchNeighborhoods();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Dados enviados:', formData); // Log dos dados enviados
    
        // Verifique se todos os campos necessários estão preenchidos
        if (!formData.codigo || !formData.bairro || !formData.cidade_id) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/api/bairros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData.codigo,
                    nome: formData.bairro,
                }),
            });
    
            if (response.ok) {
                alert('Bairro adicionado com sucesso!');
                setFormData({
                    codigo: '',
                    bairro: '',
                });
                // Atualiza a lista de bairros após adicionar um novo bairro
                const data = await response.json();
                setNeighborhoods(prevNeighborhoods => [...prevNeighborhoods, data]);
            } else {
                const text = await response.text();
                try {
                    const errorData = JSON.parse(text);
                    console.error('Erro na resposta:', errorData); // Log do erro na resposta
                } catch (e) {
                    console.error('Resposta não é um JSON válido:', text); // Log da resposta não JSON
                }
                throw new Error('Erro ao adicionar bairro');
            }
        } catch (error) {
            console.error('Error adding neighborhood:', error);
            alert('Erro ao adicionar bairro');
        }
    };

    const handleCancel = () => {
        setFormData({
            codigo: '',
            bairro: '',
        });
        navigate('/');
    };

    return (
        <Card>
            <h1>Cadastro de Bairro</h1>
            <div className="card">
                <TabView>
                    <TabPanel header="Lista">
                        <div className="grid">
                            {neighborhoods.map(neighborhood => (
                                <div key={neighborhood.id} className="col-12 md:col-6 lg:col-4">
                                    <Card title={neighborhood.nome} >
                                        <p><strong>Código:</strong> {neighborhood.id}</p>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                    <TabPanel header="Incluir" leftIcon="pi pi-map-marker mr-2">
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
                                <div className="col-12 md:col-6 lg:col-2">
                                    <FloatLabel>
                                        <InputText
                                            name="cidade_id"
                                            id="cidade_id"
                                            value={formData.cidade_id}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="cidade_id">Cidade ID</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div className="card flex flex-wrap justify-content-left gap-3">
                                <Button type="submit" label="Confirmar" severity="success" />
                                <Button
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