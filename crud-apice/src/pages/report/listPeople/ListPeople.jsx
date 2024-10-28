import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';

const RelatorioPessoas = () => {
  const [pessoas, setPessoas] = useState([]);
  const [filteredPessoas, setFilteredPessoas] = useState([]);
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
      const response = await fetch(`http://localhost:3001/api/pessoas`);
      const data = await response.json();
      setPessoas(data);
      setFilteredPessoas(data); // Exibir todos inicialmente
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
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };
      applyFilters(newFilters);
      return newFilters;
    });
  };

  const applyFilters = (filters) => {
    const filtered = pessoas.filter((pessoa) => {
      return (
        (filters.nome === '' || pessoa.nome.toLowerCase().includes(filters.nome.toLowerCase())) &&
        (filters.cidade === '' || getNomeCidade(pessoa.cidade_id).toLowerCase().includes(filters.cidade.toLowerCase())) &&
        (filters.bairro === '' || pessoa.bairro.toLowerCase().includes(filters.bairro.toLowerCase()))
      );
    });
    setFilteredPessoas(filtered);
  };

  const getNomeCidade = (cidadeId) => {
    const cidade = cidades.find((cidade) => cidade.id === cidadeId);
    return cidade ? cidade.nome : 'Desconhecida';
  };

  return (
    <div className="p-m-4">
      <Card className="p-shadow-4" style={{ borderRadius: '8px', padding: '2rem', backgroundColor: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333' }}>Relatório de Pessoas</h2>
        
        <Panel header="Filtros" toggleable className="p-mb-3" style={{ backgroundColor: '#e9ecef', borderRadius: '8px' }}>
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-4">
              <label htmlFor="nome" style={{ fontWeight: 'bold' }}>Nome:</label>
              <InputText
                id="nome"
                name="nome"
                value={filters.nome}
                onChange={handleInputChange}
                placeholder="Nome da pessoa"
              />
            </div>
            <div className="p-field p-col-12 p-md-4">
              <label htmlFor="cidade" style={{ fontWeight: 'bold' }}>Cidade:</label>
              <InputText
                id="cidade"
                name="cidade"
                value={filters.cidade}
                onChange={handleInputChange}
                placeholder="Cidade"
              />
            </div>
            <div className="p-field p-col-12 p-md-4">
              <label htmlFor="bairro" style={{ fontWeight: 'bold' }}>Bairro:</label>
              <InputText
                id="bairro"
                name="bairro"
                value={filters.bairro}
                onChange={handleInputChange}
                placeholder="Bairro"
              />
            </div>
          </div>
        </Panel>

        <DataTable
          value={filteredPessoas}
          paginator
          rows={10}
          className="p-datatable-gridlines"
          responsiveLayout="scroll"
          style={{ marginTop: '1rem', borderRadius: '8px' }}
        >
          <Column field="id" header="Código" style={{ textAlign: 'center' }} />
          <Column field="nome" header="Nome" style={{ textAlign: 'center' }} />
          <Column
            header="Cidade"
            body={(rowData) => getNomeCidade(rowData.cidade_id)}
            style={{ textAlign: 'center' }}
          />
          <Column field="telefone" header="Telefone" style={{ textAlign: 'center' }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default RelatorioPessoas;
