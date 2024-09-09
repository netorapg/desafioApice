import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const RelatorioPessoas = () => {
  const [pessoas, setPessoas] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [filters, setFilters] = useState({
    nome: '',
    cidade: '',
    bairro: '',
  });

  useEffect(() => {
    fetchCidades();
    fetchPessoas();
  }, []);

  const fetchPessoas = async () => {
    try {
      const queryParams = new URLSearchParams(filters);
      console.log('Parâmetros de consulta:', queryParams.toString()); // Log dos parâmetros de consulta
      const response = await fetch(`http://localhost:3001/api/pessoas?${queryParams}`);
      const text = await response.text(); // Obter a resposta como texto
      console.log('Resposta da API:', text); // Log da resposta da API
      const data = JSON.parse(text); // Fazer o parse do JSON
      setPessoas(data);
    } catch (error) {
      console.error('Erro ao buscar pessoas', error);
    }
  };

  const fetchCidades = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/cidades');
      const data = await response.json();
      setCidades(data);
    } catch (error) {
      console.error('Erro ao buscar cidades', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    console.log('Estado dos filtros:', { ...filters, [name]: value }); // Log do estado filters
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchPessoas();
  };

  const getNomeCidade = (cidadeId) => {
    const cidade = cidades.find((cidade) => cidade.id === cidadeId);
    return cidade ? cidade.nome : 'Desconhecida';
  };

  return (
    <div className="p-grid p-fluid">
      <h2>Relatório de Pessoas</h2>

      <form onSubmit={handleFilterSubmit} className="p-field p-grid">
        <div className="p-col-4">
          <label htmlFor="nome">Nome:</label>
          <InputText
            id="nome"
            name="nome"
            value={filters.nome}
            onChange={handleInputChange}
            placeholder="Nome da pessoa"
            className="p-inputtext"
          />
        </div>
        <div className="p-col-4">
          <label htmlFor="cidade">Cidade:</label>
          <InputText
            id="cidade"
            name="cidade"
            value={filters.cidade}
            onChange={handleInputChange}
            placeholder="Cidade"
          />
        </div>
        <div className="p-col-4">
          <label htmlFor="bairro">Bairro:</label>
          <InputText
            id="bairro"
            name="bairro"
            value={filters.bairro}
            onChange={handleInputChange}
            placeholder="Bairro"
          />
        </div>
        <div className="p-col-12">
          <Button type="submit" label="Filtrar" icon="pi pi-search" className="p-button-primary" />
        </div>
      </form>

      <DataTable value={pessoas} paginator rows={10} className="p-datatable-gridlines" responsiveLayout="scroll">
        <Column field="id" header="Código" />
        <Column field="nome" header="Nome" />
        <Column 
          header="Cidade" 
          body={(rowData) => getNomeCidade(rowData.cidade_id)} // Mapeia o id da cidade para o nome
        />
        <Column field="telefone" header="Telefone" />
      </DataTable>
    </div>
  );
};

export default RelatorioPessoas;