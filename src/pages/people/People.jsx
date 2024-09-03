import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import 'primeflex/primeflex.css';
import { CascadeSelect } from 'primereact/cascadeselect';
import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function People() {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
    const cities = [
        { cname: 'Maringá', code: 'PR-MG' },
        { cname: 'Paranavaí', code: 'PR-PV' },
        { cname: 'Curitiba', code: 'PR-CB' },
        { cname: 'Porto Velho', code: 'RO-PV' },
        { cname: 'Ariquemes', code: 'RO-AR' },
    ];
    const neighborhoods = [
        { nename: 'Zona 01', code: 'Z1' },
        { nename: 'Zona 02', code: 'Z2' },
        { nename: 'Zona 03', code: 'Z3' },
        { nename: 'Zona 04', code: 'Z4' },
        { nename: 'Zona 05', code: 'Z5' },
    ];
    return (
       <Card>
        <h1>Cadastro de Pessoas</h1>
         <div className="card">
            <TabView>
                <TabPanel header="Lista">
                    {/* Conteúdo da aba "Lista" */}
                </TabPanel>
                <TabPanel header="Incluir" leftIcon="pi pi-user-plus mr-2">
                    <div className="formgrid grid mb-4">
                        <div className="p-col-12 p-md-6 p-lg-4">
                            <FloatLabel>
                                <InputText name="codigo" id="codigo"  style={{width: '50%'}} />
                                <label htmlFor="codigo">Código</label>
                            </FloatLabel>
                        </div>
                        <div className="p-col-12 p-md-6 p-lg-8">
                            <FloatLabel>
                                <InputText name="nome" id="nome" style={{width: '200%'}} />
                                <label htmlFor="nome">Nome</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="formgrid grid mb-4">
                        <div className="inline p-col-12 p-md-6 p-lg-4">
                            <FloatLabel>
                                <CascadeSelect name="cidade" id="cidade" value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities}
                                    optionLabel="cname" optionGroupLabel="name" optionGroupChildren={['cities']}
                                    className="w-full md:w-14rem" breakpoint="767px" style={{ minWidth: '14rem' }} />
                                <label htmlFor="cidade">Cidade</label>
                            </FloatLabel>
                        </div>
                        <div className="inline mx-4 p-col-12 p-md-6 p-lg-4">
                            <FloatLabel>
                            <CascadeSelect name="bairro" id="bairro" value={selectedNeighborhood} onChange={(e) => setSelectedNeighborhood(e.value)} options={neighborhoods}
                                    optionLabel="nename" optionGroupLabel="name" optionGroupChildren={['states', 'cities']}
                                    className="w-full md:w-14rem" breakpoint="767px" style={{ minWidth: '14rem' }} />
                                <label htmlFor="bairro">Bairro</label>
                            </FloatLabel>
                        </div>
                        <div className="inline  p-col-12 p-md-6 p-lg-4">
                            <FloatLabel>
                                <InputText name="cep" id="cep" style={{width: '95%'}} />
                                <label htmlFor="cep">CEP</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="formgrid grid mb-4">
                        <div className="inline p-col-12 p-md-6 p-lg-4">
                            <FloatLabel>
                                <InputText name="endereco" id="endereco" style={{width: '92%'}} />
                                <label htmlFor="endereco">Endereço</label>
                            </FloatLabel>
                        </div>
                        <div className=" mx-2 p-col-12 p-md-6 p-lg-4">
                            <FloatLabel>
                                <InputText name="numero" id="numero" style={{width: '40%'}} />
                                <label htmlFor="numero">Número</label>
                            </FloatLabel>
                        </div>
                        <div className="inline  p-col-12 p-md-6 p-lg-4">
                            <FloatLabel>
                                <InputText name="complemento" id="complemento" style={{width: '92%'}} />
                                <label htmlFor="complemento">Complemento</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div className="formgrid grid mb-4">
                        <div className="inline p-col-12 p-md-6 p-lg-4">
                            <FloatLabel>
                                <InputText name="telefone" id="telefone" />
                                <label htmlFor="telefone">Telefone</label>
                            </FloatLabel>
                        </div>
                        <div className="inline mx-4 p-col-12 p-md-6 p-lg-4">
                            <FloatLabel>
                                <InputText name="email" id="email" style={{width: '190%'}} />
                                <label htmlFor="email">e-mail</label>
                            </FloatLabel>
                        </div>
                    </div>
                  <div className='card flex flex-wrap justify-content-left gap-3'>
                  <Button label="Confirmar" severity="success" />
                  <Button label="Cancelar" severity="danger" />
                  </div>

                </TabPanel>
            </TabView>
        </div>
       </Card>
    );
}
