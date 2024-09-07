import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';

export default function City() {
    const [formData, setFormData] = useState({
        codigo: '',
        cidade: '',
        uf: ''
    });

    const [cities, setCities] = useState([]);

    const navigate = useNavigate();


    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch ('http://localhost:3001/api/cidades');
                const data = await response.json();
                setCities(data);
            } catch (error) {
                console.error('Error fetching cities:', error);
                alert('Erro ao buscar cidades');
            }
        };
        fetchCities();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Dados enviados:', formData); // Log dos dados enviados
    
        // Verifique se todos os campos necessários estão preenchidos
        if (!formData.codigo || !formData.cidade || !formData.uf) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/api/cidades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData.codigo,
                    nome: formData.cidade,
                    uf: formData.uf
                }),
            });
    
            if (response.ok) {
                alert('Cidade adicionada com sucesso!');
                setFormData({
                    codigo: '',
                    cidade: '',
                    uf: ''
                });
            } else {
                const text = await response.text();
                try {
                    const errorData = JSON.parse(text);
                    console.error('Erro na resposta:', errorData); // Log do erro na resposta
                } catch (e) {
                    console.error('Resposta não é um JSON válido:', text); // Log da resposta não JSON
                }
                throw new Error('Erro ao adicionar cidade');
            }
        } catch (error) {
            console.error('Error adding city:', error);
            alert('Erro ao adicionar cidade');
        }
    };

    const handleCancel = () => {
        setFormData({
            codigo: '',
            cidade: '',
            uf: ''
        });
        navigate('/');
    };

    const handleDelete = async (cityId) => {
        if (window.confirm('Tem certeza que deseja deletar esta cidade?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/cidades/${cityId}`, {
                    method: 'DELETE',
                });
    
                if (response.ok) {
                    alert('Cidade deletada com sucesso!');
                    setCities(cities.filter(city => city.id !== cityId)); // Atualizar a lista localmente
                } else {
                    alert('Erro ao deletar cidade');
                }
            } catch (error) {
                console.error('Erro ao deletar cidade:', error);
                alert('Erro ao deletar cidade');
            }
        }
    };
    
    
    return (
        <Card>
            <h1>Cadastro de Cidade</h1>
            <div className="card">
                <TabView>
                    <TabPanel header="Lista">
                    <div className="grid">
                            {cities.map(city => (
                                <div key={city.id} className="col-12 md:col-6 lg:col-4">
                                    <Card title={city.nome} subTitle={city.uf}>
                                        <p><strong>Código:</strong> {city.id}</p>
                                        <Button
                                            label="Deletar"
                                            icon="pi pi-trash"
                                            className="p-button-danger"
                                            onClick={() => handleDelete(city.id)}
                                        />
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
                                            name="cidade"
                                            id="cidade"
                                            value={formData.cidade}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="cidade">Cidade</label>
                                    </FloatLabel>
                                </div>
                                <div className="col-12 md:col-6 lg:col-2">
                                    <FloatLabel>
                                        <InputText
                                            name="uf"
                                            id="uf"
                                            value={formData.uf}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="uf">Sigla UF</label>
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