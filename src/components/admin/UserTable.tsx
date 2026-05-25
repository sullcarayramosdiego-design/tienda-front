/**
 * UserTable Component
 * 
 * Displays and manages user data in a table format
 * TODO: Implement user management functionality
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UserTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          User table component - to be implemented
        </p>
      </CardContent>
    </Card>
  );
}
