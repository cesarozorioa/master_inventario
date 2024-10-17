import { useState, useEffect } from 'react';
import { Menubar } from 'primereact/menubar';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: ''
    });
    const [token, setToken] = useState(null);  // Para guardar el token generado

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users/');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const createUser = async () => {
        try {
            const response = await axios.post('/api/users/', newUser);
            fetchUsers();
            setVisible(false);
            setNewUser({ username: '', email: '', first_name: '', last_name: '' });
            
            // Guardar el token generado
            setToken(response.data.token);
        } catch (error) {
            console.error('Error creating user', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`/api/users/${userId}/`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user', error);
        }
    };

    const menuItems = [
        {
            label: 'Create User',
            icon: 'pi pi-user-plus',
            command: () => setVisible(true)
        },
        {
            label: 'Delete User',
            icon: 'pi pi-user-minus',
            command: () => {
                // Logic to handle user deletion from the table
            }
        },
        {
            label: 'View Users',
            icon: 'pi pi-users',
            command: () => fetchUsers()
        }
    ];

    return (
        <div>
            <Menubar model={menuItems} />

            {/* Mostrar el token si se ha generado */}
            {token && <p>Generated Token: {token}</p>}

            {/* Table to view users */}
            <DataTable value={users}>
                <Column field="username" header="Username"></Column>
                <Column field="email" header="Email"></Column>
                <Column field="first_name" header="First Name"></Column>
                <Column field="last_name" header="Last Name"></Column>
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <Button
                            icon="pi pi-trash"
                            className="p-button-danger"
                            onClick={() => deleteUser(rowData.id)}
                        />
                    )}
                ></Column>
            </DataTable>

            {/* Dialog for creating new user */}
            <Dialog
                header="Create New User"
                visible={visible}
                style={{ width: '400px' }}
                modal
                onHide={() => setVisible(false)}
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="username">Username</label>
                        <InputText
                            id="username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="first_name">First Name</label>
                        <InputText
                            id="first_name"
                            value={newUser.first_name}
                            onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="last_name">Last Name</label>
                        <InputText
                            id="last_name"
                            value={newUser.last_name}
                            onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                        />
                    </div>
                    <Button label="Create User" icon="pi pi-check" onClick={createUser} />
                </div>
            </Dialog>
        </div>
    );
};
