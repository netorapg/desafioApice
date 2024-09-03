import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';

export default function Product() {
    return (
        <Card>
            <h1>Cadastro de Produto</h1>
            <div className="card">
                <TabView>
                    <TabPanel header="Lista">
                        {/* Conteúdo da aba "Lista" */}
                    </TabPanel>
                    <TabPanel header="Incluir" leftIcon="pi pi-plus-circle mr-2">
                        <div className="formgrid grid mb-4">
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="codigo" id="codigo" style={{ width: '100%' }} />
                                    <label htmlFor="codigo">Código</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6">
                                <FloatLabel>
                                    <InputText name="nome" id="nome" style={{ width: '100%' }} />
                                    <label htmlFor="nome">Nome do Produto</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="valor-venda" id="valor-venda" style={{ width: '100%' }} />
                                    <label htmlFor="valor-venda">Valor Venda</label>
                                </FloatLabel>
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
