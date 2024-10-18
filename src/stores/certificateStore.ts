import { defineStore } from 'pinia'
import currentCertificate from '@/assets/currentCertificate.json'

interface Certificate {
  sections: [
    {
      id: number
      title: string
      validationPoints: [
        {
          id: number
          title: string
          required: boolean
          validated: boolean
        }
      ]
    }
  ]
  prohibitedCodes?: string[]
}

interface CertificateValidation {
  legibilityStatus: boolean
  message: string
  docType: string
  extractedFields: {
    [key: string]: string | null
  }
}

export type RootState = {
  showCertificateChecks: boolean
  currentCertificate: Certificate
  certificatePoCValidation: CertificateValidation | null
}

export const useCertificateStore = defineStore({
  id: 'certificate',
  state: () =>
    ({
      showCertificateChecks: false,
      currentCertificate: currentCertificate,
      certificatePoCValidation: null
    }) as RootState,
  getters: {},
  actions: {}
})
