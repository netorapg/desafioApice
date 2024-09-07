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
                                    <Dropdown name="produto" id="produto" value={selectedProduct} onChange={(e) => setSelectedProduct(e.value)} 
                                        options={products} optionLabel="nome" placeholder="Selecione o produto" className="w-full" />
                                    <label htmlFor="produto">Produto</label>
                                </FloatLabel>
                            </div>
                            <div className="mx-4 col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="qtde-venda" id="qtde-venda" style={{ width: '100%' }} />
                                    <label htmlFor="qtde-venda">Qtde Venda</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="vr-unitario" id="vr-unitario" style={{ width: '100%' }} />
                                    <label htmlFor="vr-unitario">Vr. Unitário</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="sub-total" id="sub-total" style={{ width: '100%' }} />
                                    <label htmlFor="sub-total">Sub. Total</label>
                                </FloatLabel>
                            </div>
                            <div className='col-12 md:col-6 lg:col-2'>
                                <Button icon="pi pi-cart-plus" severity='secondary' outlined />
                            </div>
                        </div>
                        <div className="card flex flex-wrap justify-content-left gap-3">
                            <Button label="Confirmar" severity="success" />
                            <Button label="Cancelar" severity="danger" />
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </Card>
    );
}
