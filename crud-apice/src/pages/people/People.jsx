import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';

export default function Pessoa() {
    const [formData, setFormData] = useState({
        codigo: '',
        nome: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        telefone: '',
        email: '',
        cidade_id: '',
        bairro_id: ''
    });

    const [people, setPeople] = useState([]); // Estado para armazenar as pessoas
    const [cities, setCities] = useState([]); // Estado para armazenar as cidades
    const [neighborhoods, setNeighborhoods] = useState([]); // Estado para armazenar os bairros
    const [editingId, setEditingId] = useState(null); // Estado para armazenar o ID da pessoa em edição

    const navigate = useNavigate();

    // Função para buscar pessoas
    const fetchPeople = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/pessoas');
            const data = await response.json();
            setPeople(data);
        } catch (error) {
            console.error('Error fetching people:', error);
        }
    };

    // Função para buscar cidades
    const fetchCities = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/cidades');
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    // Função para buscar bairros
    const fetchNeighborhoods = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/bairros');
            const data = await response.json();
            setNeighborhoods(data);
        } catch (error) {
            console.error('Error fetching neighborhoods:', error);
        }
    };

    useEffect(() => {
        fetchPeople();
        fetchCities();
        fetchNeighborhoods();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifique se todos os campos estão preenchidos
        if (!formData.codigo || !formData.nome || !formData.cep || !formData.endereco || !formData.numero || !formData.telefone || !formData.email || !formData.cidade_id || !formData.bairro_id) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId 
            ? `http://localhost:3001/api/pessoas/${editingId}` 
            : 'http://localhost:3001/api/pessoas';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData.codigo,
                    nome: formData.nome,
                    cep: formData.cep,
                    endereco: formData.endereco,
                    numero: formData.numero,
                    complemento: formData.complemento,
                    telefone: formData.telefone,
                    email: formData.email,
                    cidade_id: formData.cidade_id,
                    bairro_id: formData.bairro_id
                }),
            });

            if (response.ok) {
                alert(editingId ? 'Pessoa atualizada com sucesso!' : 'Pessoa adicionada com sucesso!');
                setFormData({
                    codigo: '',
                    nome: '',
                    cep: '',
                    endereco: '',
                    numero: '',
                    complemento: '',
                    telefone: '',
                    email: '',
                    cidade_id: '',
                    bairro_id: ''
                });
                setEditingId(null);
                fetchPeople();
            } else {
                throw new Error('Erro ao adicionar ou atualizar pessoa');
            }
        } catch (error) {
            console.error('Error adding/updating person:', error);
            alert('Erro ao adicionar ou atualizar pessoa');
        }
    };

    const handleEdit = (person) => {
        setFormData({
            codigo: person.id,
            nome: person.nome,
            cep: person.cep,
            endereco: person.endereco,
            numero: person.numero,
            complemento: person.complemento,
            telefone: person.telefone,
            email: person.email,
            cidade_id: person.cidade_id,
            bairro_id: person.bairro_id
        });
        setEditingId(person.id);
    };

    const handleDelete = async (personId) => {
        if (window.confirm('Tem certeza que deseja deletar esta pessoa?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/pessoas/${personId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Pessoa deletada com sucesso!');
                    setPeople(prevPeople => prevPeople.filter(person => person.id !== personId));
                } else {
                    throw new Error('Erro ao deletar pessoa');
                }
            } catch (error) {
                console.error('Error deleting person:', error);
                alert('Erro ao deletar pessoa');
            }
        }
    };

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
            cidade_id: '',
            bairro_id: ''
        });
        setEditingId(null);
        navigate('/');
    };

    return (
        <Card>
            <h1>{editingId ? "Editar Pessoa" : "Pessoa"}</h1>
            <div className="card">
                <TabView>
                    <TabPanel header="Lista">
                        <div className="grid">
                            {people.map(person => (
                                <div key={person.id} className="col-12 md:col-6 lg:col-4 mb-3">
                                    <Card title={person.nome} subTitle={`Cidade: ${cities.find(city => city.id === person.cidade_id)?.nome || "N/A"}`}>
                                        <p><strong>Código:</strong> {person.id}</p>
                                        <p><strong>Telefone:</strong> {person.telefone}</p>
                                        <Button icon="pi pi-pencil" className="p-button-warning mr-2" onClick={() => handleEdit(person)} />
                                        <Button icon="pi pi-trash" className="p-button-danger" onClick={() => handleDelete(person.id)} />
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                    <TabPanel header={editingId ? "Editar" : "Incluir"} leftIcon="pi pi-user-plus mr-2">
                        <form onSubmit={handleSubmit}>
                            <div className="formgrid grid mb-4">
                                <div className="col-12 md:col-6 lg:col-2 mb-3">
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
                                <div className="col-12 md:col-6 lg:col-6 mb-3">
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
                                <div className="col-12 md:col-6 lg:col-2 mb-3">
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
                                <div className="col-12 md:col-6 lg:col-6 mb-3">
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
                                <div className="col-12 md:col-6 lg:col-2 mb-3">
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
                                <div className="col-12 md:col-6 lg:col-3 mb-3">
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
                                <div className="col-12 md:col-6 lg:col-3 mb-3">
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
                                <div className="col-12 md:col-6 lg:col-3 mb-3">
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
                                <div className="col-12 md:col-6 lg:col-3 mb-3">
                                    <FloatLabel>
                                        <Dropdown
                                            name="cidade_id"
                                            id="cidade_id"
                                            value={formData.cidade_id}
                                            options={cities}
                                            onChange={(e) => handleChange({ target: { id: 'cidade_id', value: e.value } })}
                                            optionLabel="nome"
                                            placeholder="Selecione a cidade"
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="cidade_id">Cidade</label>
                                    </FloatLabel>
                                </div>
                                <div className="col-12 md:col-6 lg:col-3 mb-3">
                                    <FloatLabel>
                                        <Dropdown
                                            name="bairro_id"
                                            id="bairro_id"
                                            value={formData.bairro_id}
                                            options={neighborhoods}
                                            onChange={(e) => handleChange({ target: { id: 'bairro_id', value: e.value } })}
                                            optionLabel="nome"
                                            placeholder="Selecione o bairro"
                                            style={{ width: '100%' }}
                                        />
                                        <label htmlFor="bairro_id">Bairro</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div className="form-actions">
                                <Button label={editingId ? "Atualizar" : "Incluir"} type="submit" className="p-button-success mr-2" />
                                <Button label="Cancelar" type="button" className="p-button-danger" onClick={handleCancel} />
                            </div>
                        </form>
                    </TabPanel>
                </TabView>
            </div>
        </Card>
    );
}
