import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  CircularProgress
} from '@mui/material';
import api from '../api/api.tsx';
import { useNotification } from '../context/NotificationContext.tsx';

interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch {
      notify('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: number, isAdmin: boolean) => {
    try {
      await api.put(`/admin/users/${userId}`, { isAdmin: !isAdmin });
      notify('User updated successfully', 'success');
      fetchUsers();
    } catch {
      notify('Failed to update user', 'error');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell align="center">Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.email}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={user.isAdmin}
                    onChange={() => toggleAdmin(user.id, user.isAdmin)}
                    inputProps={{ 'aria-label': 'admin checkbox' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
