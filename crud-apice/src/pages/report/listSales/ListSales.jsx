import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button'; // Importando o botão

const RelatorioVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [filteredVendas, setFilteredVendas] = useState([]);
  const [pessoasMap, setPessoasMap] = useState({});
  const [filters, setFilters] = useState({
    dataInicio: null,
    dataFim: null,
    pessoa: '',
    produto: '',
  });

  useEffect(() => {
    fetchPessoas();
    fetchVendas();
  }, []);

  useEffect(() => {
    applyFilters(filters); // Passa os filters para a função
  }, [vendas, filters]);

  const fetchPessoas = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/pessoas`);
      const data = await response.json();
      const map = Object.fromEntries(data.map(pessoa => [pessoa.id, pessoa.nome]));
      setPessoasMap(map);
    } catch (error) {
      console.error('Erro ao buscar pessoas', error);
    }
  };

  const fetchVendas = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/vendas`);
      const data = await response.json();
      setVendas(data);
      setFilteredVendas(data); // Mantenha os dados filtrados iniciais
    } catch (error) {
      console.error('Erro ao buscar vendas', error);
    }
  };

  const applyFilters = (filters) => {
    const filtered = vendas.filter((venda) => {
      const dtVenda = new Date(venda.dt_venda);
      
      return (
        (!filters.dataInicio || dtVenda >= new Date(filters.dataInicio)) &&
        (!filters.dataFim || dtVenda <= new Date(filters.dataFim)) &&
        (!filters.pessoa || pessoasMap[venda.pessoa_id]?.toLowerCase().includes(filters.pessoa.toLowerCase())) &&
        (!filters.produto || (venda.produto && venda.produto.toLowerCase().includes(filters.produto.toLowerCase())))
      );
    });
  
    setFilteredVendas(filtered);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };


  return (
    <div className="p-m-4">
      <Card className="p-shadow-4" style={{ borderRadius: '8px', padding: '2rem', backgroundColor: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>Relatório de Vendas</h2>

        <Panel header="Filtros" toggleable className="p-mb-3" style={{ backgroundColor: '#e9ecef', borderRadius: '8px' }}>
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="dataInicio" style={{ fontWeight: 'bold' }}>Data Início:</label>
              <Calendar
                id="dataInicio"
                name="dataInicio"
                value={filters.dataInicio}
                onChange={(e) => handleDateChange('dataInicio', e.value)}
                dateFormat="yy-mm-dd"
                placeholder="Selecione a data"
                className="w-full"
              />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="dataFim" style={{ fontWeight: 'bold' }}>Data Fim:</label>
              <Calendar
                id="dataFim"
                name="dataFim"
                value={filters.dataFim}
                onChange={(e) => handleDateChange('dataFim', e.value)}
                dateFormat="yy-mm-dd"
                placeholder="Selecione a data"
                className="w-full"
              />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="pessoa" style={{ fontWeight: 'bold' }}>Pessoa:</label>
              <InputText
                id="pessoa"
                name="pessoa"
                value={filters.pessoa}
                onChange={handleInputChange}
                placeholder="Filtrar por pessoa"
                className="w-full"
              />
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="produto" style={{ fontWeight: 'bold' }}>Produto:</label>
              <InputText
                id="produto"
                name="produto"
                value={filters.produto}
                onChange={handleInputChange}
                placeholder="Filtrar por produto"
                className="w-full"
              />
            </div>
          </div>
        </Panel>

        <DataTable value={filteredVendas.length > 0 ? filteredVendas : vendas} className="mt-4">
          <Column field="id" header="Código" style={{ textAlign: 'center' }} />
          <Column field="pessoa_id" header="ID da Pessoa" style={{ textAlign: 'center' }} />
          <Column field="nome_pessoa" header="Nome da Pessoa" body={(rowData) => pessoasMap[rowData.pessoa_id] || 'Nome não disponível'} style={{ textAlign: 'center' }} />
          <Column field="total_venda" header="Total Venda" style={{ textAlign: 'center' }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default RelatorioVendas;
