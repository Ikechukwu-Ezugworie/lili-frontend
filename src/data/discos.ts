import { ref } from 'vue'
import { aedc, eedc, ekedc, ibedc, ikeja, jedc, kedc, kedco, phedc } from '../assets/disco_logos'

export const discos = ref([
  { label: 'AEDC (Abuja)', value: 1, logo: aedc },
  { label: 'BEDC (Benin)', value: 2, logo: aedc },
  { label: 'EEDC (Enugu)', value: 3, logo: eedc },
  { label: 'EEDC (Eko)', value: 4, logo: ekedc },
  { label: 'IBEDC (Ibadan)', value: 5, logo: ibedc },
  { label: 'IEDC (Ikeja)', value: 6, logo: ikeja },
  { label: 'JEDC (Jos)', value: 7, logo: jedc },
  { label: 'KEDC (Kaduna)', value: 8, logo: kedc },
  { label: 'KEDCO (Kano)', value: 9, logo: kedco },
  { label: 'PHEDC (Port-harcourt)', value: 10, logo: phedc },
  { label: 'YEDC (Yola)', value: 11, logo: aedc },
])
