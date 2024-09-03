import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';

export default function City() {
    return (
        <Card>
            <h1>Cadastro de Cidade</h1>
            <div className="card">
                <TabView>
                    <TabPanel header="Lista">
                        {/* Conteúdo da aba "Lista" */}
                    </TabPanel>
                    <TabPanel header="Incluir" leftIcon="pi pi-map-marker mr-2">
                        <div className="formgrid grid mb-4">
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="codigo" id="codigo" style={{ width: '100%' }} />
                                    <label htmlFor="codigo">Código</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6">
                                <FloatLabel>
                                    <InputText name="cidade" id="cidade" style={{ width: '100%' }} />
                                    <label htmlFor="cidade">Cidade</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 md:col-6 lg:col-2">
                                <FloatLabel>
                                    <InputText name="uf" id="uf" style={{ width: '100%' }} />
                                    <label htmlFor="uf">Sigla UF</label>
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
