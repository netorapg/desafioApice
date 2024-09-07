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
    const [editingCityId, setEditingCityId] = useState(null); // Estado para edição

    const navigate = useNavigate();

    // Função fetchCities movida para fora do useEffect
    const fetchCities = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/cidades');
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
            alert('Erro ao buscar cidades');
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingCityId 
            ? `http://localhost:3001/api/cidades/${editingCityId}` 
            : 'http://localhost:3001/api/cidades';
        const method = editingCityId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
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
                alert(editingCityId ? 'Cidade atualizada com sucesso!' : 'Cidade adicionada com sucesso!');
                setFormData({
                    codigo: '',
                    cidade: '',
                    uf: ''
                });
                setEditingCityId(null); // Resetar estado de edição
                fetchCities(); // Atualizar a lista de cidades
            } else {
                throw new Error(editingCityId ? 'Erro ao atualizar cidade' : 'Erro ao adicionar cidade');
            }
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    const handleCancel = () => {
        setFormData({
            codigo: '',
            cidade: '',
            uf: ''
        });
        setEditingCityId(null);
        navigate('/');
    };

    const handleEdit = (city) => {
        setFormData({
            codigo: city.id,
            cidade: city.nome,
            uf: city.uf
        });
        setEditingCityId(city.id); // Definir o ID da cidade que está sendo editada
    };

    const handleDelete = async (cityId) => {
        if (!window.confirm('Você tem certeza que deseja excluir esta cidade?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/cidades/${cityId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Cidade excluída com sucesso!');
                setCities(cities.filter(city => city.id !== cityId)); // Atualizar a lista de cidades
            } else {
                throw new Error('Erro ao excluir cidade');
            }
        } catch (error) {
            console.error('Erro ao excluir cidade:', error);
            alert('Erro ao excluir cidade');
        }
    };

    return (
        <Card>
            <h1>{editingCityId ? 'Editar Cidade' : 'Cadastro de Cidade'}</h1>
            <div className="card">
                <TabView>
                    <TabPanel header="Lista">
                        <div className="grid">
                            {cities.map(city => (
                                <div key={city.id} className="col-12 md:col-6 lg:col-4">
                                    <Card title={city.nome} subTitle={city.uf}>
                                        <p><strong>Código:</strong> {city.id}</p>
                                            <Button  
                                                icon="pi pi-pencil" 
                                                className="p-button-warning"
                                                onClick={() => handleEdit(city)} 
                                            />
                                            <Button                                             
                                                icon="pi pi-trash" 
                                                className="p-button-danger" 
                                                onClick={() => handleDelete(city.id)} 
                                                style={{ marginLeft: '10px' }}
                                            />
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                    <TabPanel header={editingCityId ? "Editar" : "Incluir"} leftIcon="pi pi-map-marker mr-2">
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
                                            disabled={editingCityId !== null} // Desabilitar o campo "Código" ao editar
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
