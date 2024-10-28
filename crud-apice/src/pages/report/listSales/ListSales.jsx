import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

const RelatorioVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [filteredVendas, setFilteredVendas] = useState([]);
  const [filters, setFilters] = useState({
    dataInicio: '',
    dataFim: '',
    pessoa: '',
    produto: '',
  });

  // Fetch initial vendas data on mount
  useEffect(() => {
    fetchVendas();
  }, []);

  // Apply filters whenever vendas or filters change
  useEffect(() => {
    applyFilters();
  }, [vendas, filters]);

  const fetchVendas = async () => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`http://localhost:3001/api/vendas?${queryParams}`);
      const data = await response.json();
      console.log('Dados recebidos:', data); // Verifique a estrutura dos dados
      setVendas(data);
    } catch (error) {
      console.error('Erro ao buscar vendas', error);
    }
  };

  const applyFilters = () => {
    try {
      const filtered = vendas.filter((venda) => {
        if (!venda) return false; // Verifica se a venda é válida
        const matchesDataInicio = filters.dataInicio ? new Date(venda.data) >= new Date(filters.dataInicio) : true;
        const matchesDataFim = filters.dataFim ? new Date(venda.data) <= new Date(filters.dataFim) : true;
        const matchesPessoa = venda.nome_pessoa && venda.nome_pessoa.toLowerCase().includes(filters.pessoa.toLowerCase());
        const matchesProduto = venda.produto && venda.produto.toLowerCase().includes(filters.produto.toLowerCase());

        return matchesDataInicio && matchesDataFim && matchesPessoa && matchesProduto;
      });
      setFilteredVendas(filtered);
    } catch (error) {
      console.error('Erro ao aplicar filtros', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    applyFilters(); // Aplicar os filtros manualmente ao submeter o formulário
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Relatório de Vendas</h2>

      <form onSubmit={handleFilterSubmit} className="p-fluid">
        <div className="field mb-3">
          <label htmlFor="dataInicio" className="block text-sm font-medium mb-1">Data Início:</label>
          <Calendar
            id="dataInicio"
            name="dataInicio"
            value={filters.dataInicio ? new Date(filters.dataInicio) : null}
            onChange={(e) => setFilters({ ...filters, dataInicio: e.value ? e.value.toISOString().split('T')[0] : '' })}
            dateFormat="yy-mm-dd"
            placeholder="Selecione a data"
            className="w-full"
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="dataFim" className="block text-sm font-medium mb-1">Data Fim:</label>
          <Calendar
            id="dataFim"
            name="dataFim"
            value={filters.dataFim ? new Date(filters.dataFim) : null}
            onChange={(e) => setFilters({ ...filters, dataFim: e.value ? e.value.toISOString().split('T')[0] : '' })}
            dateFormat="yy-mm-dd"
            placeholder="Selecione a data"
            className="w-full"
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="pessoa" className="block text-sm font-medium mb-1">Pessoa:</label>
          <InputText
            id="pessoa"
            name="pessoa"
            value={filters.pessoa}
            onChange={handleInputChange}
            placeholder="Filtrar por pessoa"
            className="w-full"
          />
        </div>
        <div className="field mb-3">
          <label htmlFor="produto" className="block text-sm font-medium mb-1">Produto:</label>
          <InputText
            id="produto"
            name="produto"
            value={filters.produto}
            onChange={handleInputChange}
            placeholder="Filtrar por produto"
            className="w-full"
          />
        </div>
        <Button type="submit" label="Filtrar" className="p-button p-component" />
      </form>

      <DataTable value={filteredVendas} className="mt-4">
        <Column field="id" header="Código" />
        <Column field="nome_pessoa" header="Nome da Pessoa" />
        <Column field="total_venda" header="Total Venda" />
      </DataTable>
    </div>
  );
};

export default RelatorioVendas;
