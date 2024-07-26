import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Modal from 'react-modal';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
`;

const AmbienteForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const AmbienteInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const AmbienteButton = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  padding: 10px;
  background: #007bff;
  color: #fff;
  text-align: left;
  border-bottom: 2px solid #0056b3;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f8f8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SelectedTitle = styled.h2`
  font-size: 1.5em;
  margin-top: 20px;
  margin-bottom: 10px;
`;

Modal.setAppElement('#root');

export function AmbienteTemplate() {
  const [ambientes, setAmbientes] = useState([]);
  const [newAmbiente, setNewAmbiente] = useState('');
  const [token, setToken] = useState(''); // Necesitas proporcionar un valor para el token
  const [selectedAmbientes, setSelectedAmbientes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAmbiente, setCurrentAmbiente] = useState(null);
  const [updateNombre, setUpdateNombre] = useState('');

  useEffect(() => {
    if (token) {
      axios.get('/api/ambientes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
          setAmbientes(response.data);
        })
      .catch(error => {
          console.error(error);
        });
    }
  }, [token]);

  const handleCreateAmbiente = (event) => {
    event.preventDefault();
    axios.post('/api/ambientes', {
      nombre: newAmbiente,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
        setAmbientes([...ambientes, response.data]);
        setNewAmbiente('');
      })
    .catch(error => {
        console.error(error);
      });
  };

  const handleUpdateAmbiente = () => {
    axios.put(`/api/ambientes/${currentAmbiente.id}`, {
      nombre: updateNombre,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
        setAmbientes(ambientes.map(ambiente => ambiente.id === currentAmbiente.id ? response.data : ambiente));
        setIsModalOpen(false);
        setCurrentAmbiente(null);
        setUpdateNombre('');
      })
    .catch(error => {
        console.error(error);
      });
  };

  const handleDeleteAmbiente = (id) => {
    axios.delete(`/api/ambientes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
        setAmbientes(ambientes.filter(ambiente => ambiente.id !== id));
        setSelectedAmbientes(selectedAmbientes.filter(a => a.id !== id)); // Remove from selected if deleted
      })
    .catch(error => {
        console.error(error);
      });
  };

  const handleSelectAmbiente = (ambiente) => {
    if (selectedAmbientes.some(a => a.id === ambiente.id)) {
      setSelectedAmbientes(selectedAmbientes.filter(a => a.id !== ambiente.id));
    } else {
      setSelectedAmbientes([...selectedAmbientes, ambiente]);
    }
  };

  const openUpdateModal = (ambiente) => {
    setCurrentAmbiente(ambiente);
    setUpdateNombre(ambiente.nombre);
    setIsModalOpen(true);
  };

  return (
    <Container>
      <Title>Vista de Ambientes</Title>
      <AmbienteForm onSubmit={handleCreateAmbiente}>
        <AmbienteInput
          type="text"
          value={newAmbiente}
          onChange={(event) => setNewAmbiente(event.target.value)}
          placeholder="Nombre del ambiente"
        />
        <AmbienteButton type="submit">Crear ambiente</AmbienteButton>
      </AmbienteForm>
      <Table>
        <thead>
          <tr>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </tr>
        </thead>
        <tbody>
          {ambientes.map(ambiente => (
            <TableRow key={ambiente.id}>
              <TableCell>{ambiente.nombre}</TableCell>
              <TableCell>
                <ButtonGroup>
                  <AmbienteButton onClick={() => openUpdateModal(ambiente)}>Editar</AmbienteButton>
                  <AmbienteButton onClick={() => handleDeleteAmbiente(ambiente.id)}>Eliminar</AmbienteButton>
                  <AmbienteButton onClick={() => handleSelectAmbiente(ambiente)}>Seleccionar</AmbienteButton>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <SelectedTitle>Ambientes seleccionados:</SelectedTitle>
      <Table>
        <tbody>
          {selectedAmbientes.map(ambiente => (
            <TableRow key={ambiente.id}>
              <TableCell>{ambiente.nombre}</TableCell>
              <TableCell>
                <AmbienteButton onClick={() => handleSelectAmbiente(ambiente)}>Deseleccionar</AmbienteButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Actualizar Ambiente"
        style={{
          content: {
            maxWidth: '500px',
            margin: '0 auto',
            padding: '20px',
            borderRadius: '8px',
          },
        }}
      >
        <h2>Actualizar Ambiente</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateAmbiente(); }}>
          <AmbienteInput
            type="text"
            value={updateNombre}
            onChange={(event) => setUpdateNombre(event.target.value)}
            placeholder="Nombre del ambiente"
          />
          <AmbienteButton type="submit">Actualizar</AmbienteButton>
          <AmbienteButton type="button" onClick={() => setIsModalOpen(false)}>Cancelar</AmbienteButton>
        </form>
      </Modal>
    </Container>
  );
}
