import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import 'primeflex/primeflex.css';
import { CascadeSelect } from 'primereact/cascadeselect';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

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
        email: ''
    });

    useEffect(() => {
        // Fetch cities and neighborhoods from the backend
        const fetchData = async () => {
            try {
                const citiesResponse = await fetch('http://localhost:3001/api/cidades');
                const citiesData = await citiesResponse.json();
                console.log('Cities data:', citiesData); // Adicione este log
                setCities(citiesData);

                const neighborhoodsResponse = await fetch('http://localhost:3001/api/bairros');
                const neighborhoodsData = await neighborhoodsResponse.json();
                console.log('Neighborhoods data:', neighborhoodsData); // Adicione este log
                setNeighborhoods(neighborhoodsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/pessoas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
                    email: ''
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
                                    <CascadeSelect
                            value={selectedCity}
                            options={cities}
                            optionLabel="name" // Certifique-se de que o campo correto está sendo usado
                            placeholder="Selecione uma cidade"
                            onChange={(e) => setSelectedCity(e.value)}
                        />
                                    </FloatLabel>
                                </div>
                                <div className="p-col-12 p-md-6 p-lg-4">
                                    <FloatLabel>
                                        <CascadeSelect
                                            name="bairro"
                                            id="bairro"
                                            value={selectedNeighborhood}
                                            onChange={(e) => setSelectedNeighborhood(e.value)}
                                            options={neighborhoods}
                                            optionLabel="name" // Verifique se a chave correta é "name"
                                            className="w-full"
                                            style={{ minWidth: '14rem' }}
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
                                        <label htmlFor="email">E-mail</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div className="card flex flex-wrap justify-content-left gap-3">
                                <Button type="submit" label="Confirmar" severity="success" />
                                <Button
                                    type="button"
                                    label="Cancelar"
                                    severity="danger"
                                    onClick={() => {
                                        setFormData({
                                            codigo: '',
                                            nome: '',
                                            cep: '',
                                            endereco: '',
                                            numero: '',
                                            complemento: '',
                                            telefone: '',
                                            email: ''
                                        });
                                        setSelectedCity(null);
                                        setSelectedNeighborhood(null);
                                    }}
                                />
                            </div>
                        </form>
                    </TabPanel>
                </TabView>
            </div>
        </Card>
    );
}
