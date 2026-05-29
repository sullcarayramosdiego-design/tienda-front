import { z } from 'zod';

export const DEPARTMENTS = [
  'Lima', 'Arequipa', 'Cusco', 'Callao', 'La Libertad',
  'Piura', 'Lambayeque', 'Junín', 'Áncash', 'Loreto',
] as const;

export const shippingSchema = z.object({
  firstName:      z.string().min(1, 'Requerido'),
  lastName:       z.string().min(1, 'Requerido'),
  email:          z.string().email('Email inválido'),
  phone:          z.string().refine((v) => v.replace(/\D/g, '').length >= 9, 'Mínimo 9 dígitos'),
  department:     z.string().optional(),
  province:       z.string().optional(),
  district:       z.string().optional(),
  address:        z.string().optional(),
  reference:      z.string().optional(),
  deliveryMethod: z.enum(['delivery', 'pickup']),
}).superRefine((data, ctx) => {
  if (data.deliveryMethod === 'delivery') {
    if (!data.department)          ctx.addIssue({ code: 'custom', path: ['department'], message: 'Requerido' });
    if (!data.province?.trim())    ctx.addIssue({ code: 'custom', path: ['province'],   message: 'Requerido' });
    if (!data.district?.trim())    ctx.addIssue({ code: 'custom', path: ['district'],   message: 'Requerido' });
    if (!data.address?.trim())     ctx.addIssue({ code: 'custom', path: ['address'],    message: 'Requerido' });
  }
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
