import styled from "styled-components";
import { useState, useEffect } from "react";

import { axioCliente } from "../../services/api";
import { Await } from "react-router-dom";

// Mock data

export function FichaTemplate() {
  const [fichasData, setFichasData] = useState([]);

  // Funciones para manejar acciones (crear, editar, eliminar) pueden ser añadidas aquí

  const handleEdit = (id) => {
    // Lógica para editar una ficha
  };

  const handleDelete = (id) => {
    // Lógica para eliminar una ficha
    setFichasData(fichasData.filter((ficha) => ficha.id !== id));
  };

  useEffect(() => {
    const handleCreate = async () => {
      try {

        // Lógica para crear una nueva ficha

      const res = await axioCliente.get("/fichas");

      setFichasData (res.response.data);
      console.log(res.response.data);
        
      } catch (error) {
        console.error(error.response)
      }
    };

    handleCreate()
  }, []);

  return (
    <Container>
      <Header>
        <h1>Vista Fichas</h1>
       
      </Header>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fichasData.map((ficha) => (
            <tr key={ficha.id}>
              <td>{ficha.id}</td>
              <td>{ficha.nombre}</td>
              <td>{ficha.fecha}</td>
              <td>{ficha.estado}</td>
              <td>
                <ActionButton onClick={() => handleEdit(ficha.id)}>
                  Editar
                </ActionButton>
                <ActionButton onClick={() => handleDelete(ficha.id)}>
                  Eliminar
                </ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  background-color: ${(props) => props.theme.bgtotal};
  color: ${({ theme }) => theme.text};
  width: 100%;
  padding: 20px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.text};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.primaryDark};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  thead {
    background-color: ${(props) => props.theme.headerBg};
    color: ${(props) => props.theme.headerText};
  }

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid ${(props) => props.theme.border};
  }

  tr:hover {
    background-color: ${(props) => props.theme.rowHover};
  }
`;

const ActionButton = styled.button`
  background-color: ${(props) => props.theme.actionBg};
  color: ${(props) => props.theme.text};
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 5px;
  transition: background-color 0.3s ease;

  &:last-of-type {
    margin-right: 0;
  }

  &:hover {
    background-color: ${(props) => props.theme.actionBgDark};
  }
`;
