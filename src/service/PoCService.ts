import type { AxiosResponse } from 'axios'
import { HTTPBaseService } from '@/service/httpBaseService'

export class PoCService extends HTTPBaseService {
  private static classInstance?: PoCService

  constructor() {
    super()
  }

  public static getInstance(): PoCService {
    if (!this.classInstance) {
      this.classInstance = new PoCService()
    }

    return this.classInstance
  }

  public getCertificateValidation = async (formData: FormData): Promise<AxiosResponse> => {
    return await this.instance.post(`DocumentIntelligence/GetDocumentIntelligence`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
        accept: '*/*'
      }
    })
  }
}
