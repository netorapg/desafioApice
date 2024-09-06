import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import 'primeflex/primeflex.css';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Navigate } from 'react-router-dom';


export default function People() {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
    const [cities, setCities] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [formData, setFormData] = useState({
        codigo: '',
        nome: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        telefone: '',
        email: '',
        cidade_id: null,
        bairro_id: null
    });

    useEffect(() => {
        // Fetch cities and neighborhoods from the backend
        const fetchData = async () => {
            try {
                const citiesResponse = await fetch('http://localhost:3001/api/cidades');
                const citiesData = await citiesResponse.json();
                setCities(citiesData);

                const neighborhoodsResponse = await fetch('http://localhost:3001/api/bairros');
                const neighborhoodsData = await neighborhoodsResponse.json();
                setNeighborhoods(neighborhoodsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleCancel = () => { 
        setFormData({
            codigo: '',
            nome: '',
            cep: '',
            endereco: '',
            numero: '',
            complemento: '',
            telefone: '',
            email: '',
            cidade_id: null,
            bairro_id: null
        });
        setSelectedCity(null);
        setSelectedNeighborhood(null);
        Navigate('/');
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.value);
        setFormData(prevData => ({ ...prevData, cidade_id: e.value.id }));
    };

    const handleNeighborhoodChange = (e) => {
        setSelectedNeighborhood(e.value);
        setFormData(prevData => ({ ...prevData, bairro_id: e.value.id }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            cidade_id: selectedCity?.id,
            bairro_id: selectedNeighborhood?.id
        };
        try {
            const response = await fetch('http://localhost:3001/api/pessoas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData.codigo,
                    nome: formData.nome,
                    cidade_id: postData.cidade_id,
                    bairro_id: postData.bairro_id,
                    cep: formData.cep,
                    endereco: formData.endereco,
                    numero: formData.numero,
                    complemento: formData.complemento,
                    telefone: formData.telefone,
                    email: formData.email
                }),
            });

            if (response.ok) {
                alert('Pessoa adicionada com sucesso!');
                setFormData({
                    codigo: '',
                    nome: '',
                    cep: '',
                    endereco: '',
                    numero: '',
                    complemento: '',
                    telefone: '',
                    email: '',
                    cidade_id: null,
                    bairro_id: null
                });
                setSelectedCity(null);
                setSelectedNeighborhood(null);
            } else {
                throw new Error('Erro ao adicionar pessoa');
            }
        } catch (error) {
            console.error('Error adding person:', error);
            alert('Erro ao adicionar pessoa');
        }
    };

    return (
        <Card>
            <h1>Cadastro de Pessoas</h1>
            <div className="card">
                <TabView>
                    <TabPanel header="Lista">
                        {/* Conteúdo da aba "Lista" */}
                    </TabPanel>
                    <TabPanel header="Incluir" leftIcon="pi pi-user-plus mr-2">
                        <form onSubmit={handleSubmit}>
                            <div className="formgrid grid mb-4">
                                <div className="p-col-12 p-md-6 p-lg-4">
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
                                <div className="p-col-12 p-md-6 p-lg-8">
                                    <FloatLabel>
                                        <InputText
                                            name="nome"
                                            id="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="nome">Nome</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div className="formgrid grid mb-4">
                                <div className="p-col-12 p-md-6 p-lg-4">
                                    <FloatLabel>
                                        <Dropdown
                                            value={selectedCity}
                                            options={cities}
                                            optionLabel="nome" // Certifique-se de que o campo correto está sendo usado
                                            placeholder="Selecione uma cidade"
                                            onChange={handleCityChange}
                                        />
                                        <label htmlFor="cidade">Cidade</label>
                                    </FloatLabel>
                                </div>
                                <div className="p-col-12 p-md-6 p-lg-4">
                                    <FloatLabel>
                                        <Dropdown
                                            value={selectedNeighborhood}
                                            options={neighborhoods}
                                            optionLabel="nome" // Verifique se a chave correta é "nome"
                                            placeholder="Selecione um bairro"
                                            onChange={handleNeighborhoodChange}
                                        />
                                        <label htmlFor="bairro">Bairro</label>
                                    </FloatLabel>
                                </div>
                                <div className="p-col-12 p-md-6 p-lg-4">
                                    <FloatLabel>
                                        <InputText
                                            name="cep"
                                            id="cep"
                                            value={formData.cep}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="cep">CEP</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div className="formgrid grid mb-4">
                                <div className="p-col-12 p-md-6 p-lg-4">
                                    <FloatLabel>
                                        <InputText
                                            name="endereco"
                                            id="endereco"
                                            value={formData.endereco}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="endereco">Endereço</label>
                                    </FloatLabel>
                                </div>
                                <div className="p-col-12 p-md-6 p-lg-4">
                                    <FloatLabel>
                                        <InputText
                                            name="numero"
                                            id="numero"
                                            value={formData.numero}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="numero">Número</label>
                                    </FloatLabel>
                                </div>
                                <div className="p-col-12 p-md-6 p-lg-4">
                                    <FloatLabel>
                                        <InputText
                                            name="complemento"
                                            id="complemento"
                                            value={formData.complemento}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="complemento">Complemento</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div className="formgrid grid mb-4">
                                <div className="p-col-12 p-md-6 p-lg-4">
                                    <FloatLabel>
                                        <InputText
                                            name="telefone"
                                            id="telefone"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="telefone">Telefone</label>
                                    </FloatLabel>
                                </div>
                                <div className="p-col-12 p-md-6 p-lg-4">
                                    <FloatLabel>
                                        <InputText
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="email">Email</label>
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
