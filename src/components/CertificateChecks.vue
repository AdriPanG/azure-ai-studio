<template>
  <div class="page-wrapper">
    <div class="document-detail">
      <!-- DOCUMENT IMAGE -->
      <div class="image-wrapper">
        <figure ref="zoomImg" class="zoom-image" :style="[`background-image: ${backgroundImgCss}`]">
          <img :src="rotatedImg" class="static-image" />
        </figure>
        <iframe
          class="pdf-image"
          :src="originalImg + `#toolbar=0&navpanes=0`"
          frameborder="0"
          allow="fullscreen"
        >
        </iframe>
      </div>

      <!-- DOCUMENT CHECKBOXES -->
      <div class="validation-wrapper">
        <div class="doc-number">
          <h3 class="title">Nº albarán: 25098758</h3>
          <div class="detail-header-icons">
            <img class="icon-close" src="@/assets/icons/close.svg" @click="handleClose" />
          </div>
        </div>

        <div v-if="!loadingCheckValidation" class="section-container">
          <div
            class="section-wrapper"
            v-for="(section, index) in currentCertificate.sections"
            :key="index"
          >
            <span class="section-title">{{ section.title }}</span>
            <div class="validation-list">
              <AppCheckbox
                v-for="(item, index) in section.validationPoints"
                class="checkbox"
                :key="index"
                :id="item.id"
                :title="item.title"
                :validated="item.validated"
                :required="item.required"
                @click="checkValidationPoint(item.id, section.id)"
              />
            </div>
          </div>
          <div class="prohibited-wrapper">
            <span class="section-title">Códigos prohibidos</span>
            <ul class="prohibited-list">
              <li
                class="prohibited-code-item"
                v-for="(item, index) in currentCertificate.prohibitedCodes"
                :key="index"
              >
                {{ item }}
              </li>
            </ul>
          </div>
          <span class="error-text" v-if="errors">{{ errorMsg }}</span>
          <div class="buttons">
            <button class="button" @click="handleClose">Rechazar documento</button>
            <button class="button" @click="handleValidationCheck">Validar documento</button>
          </div>
        </div>

        <div v-else>
          <AppLoader :position="convertVhToPx(40)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// IMPORTS
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useCertificateStore } from '@/stores/certificateStore'
import AppCheckbox from './AppCheckbox.vue'
import AppLoader from './AppLoader.vue'

// STORE
const { showCertificateChecks, currentCertificate, certificatePoCValidation } =
  storeToRefs(useCertificateStore())

// TYPES
interface ValidationPoint {
  title: string
  isValidated: boolean
}

interface ExtractedFieldPoint {
  extractedFieldPoint: string
  value: string | null
}

interface ProhibitedExtractedFieldPoint {
  extractedProhibitedPoint: string
  value: string | null
}

interface ProhibitedPoints {
  pocPoint: ProhibitedExtractedFieldPoint
}

interface AllPoints {
  manualVal: ValidationPoint
  pocPoint: ExtractedFieldPoint
}

// PROPS
const props = defineProps({
  fileUrl: {
    type: [String, null],
    required: true
  }
})

// DATA
const originalImg: Ref<string> = ref('')
const rotatedImg: Ref<string> = ref('')
const zoomImg: Ref<HTMLElement> = ref({} as HTMLElement)
const loadingCheckValidation: Ref<boolean> = ref(false)
const errors: Ref<string[]> = ref([])
const errorMsg: Ref<string> = ref('')
const PoCValidationDone: Ref<boolean> = ref(false)

// HOOKS
onMounted(() => {
  if (props.fileUrl) {
    originalImg.value = props.fileUrl
    rotatedImg.value = props.fileUrl
  }

  // console.log(certificatePoCValidation.value?.extractedFields)
})

// WATCHERS
watch(originalImg, async (newImg, oldImg) => {
  if (newImg) {
    createZoomEvent()
  }
})

// COMPUTED
const backgroundImgCss: ComputedRef<string> = computed(() => `url(${rotatedImg.value})`)

// METHODS
function handleClose() {
  showCertificateChecks.value = false
}

function checkValidationPoint(id: number, sectionId: number) {
  let validationPoint = currentCertificate.value.sections
    .find((item) => item.id === sectionId)
    ?.validationPoints.find((item) => item.id === id)

  if (validationPoint) validationPoint.validated = !validationPoint.validated
}

function createZoomEvent() {
  zoomImg.value?.addEventListener('mousemove', function (event: MouseEvent) {
    const targetElement = event.currentTarget as HTMLImageElement
    if (targetElement) {
      let x = (event.offsetX / targetElement.offsetWidth) * 100
      let y = (event.offsetY / targetElement.offsetHeight) * 100
      targetElement.style.backgroundPosition = x + '% ' + y + '%'
    }
  })
}

function convertVhToPx(valueInVh: number, viewportHeight: number | null = null): number {
  const oneVhInPx =
    (viewportHeight || window.innerHeight || document.documentElement.clientHeight) / 100
  const valueInPx = oneVhInPx * valueInVh
  return valueInPx
}

function getValidatedChecks() {
  let pointArr: ValidationPoint[] = []
  currentCertificate.value.sections.forEach((section) => {
    section.validationPoints.forEach((point) => {
      pointArr.push({ title: point.title, isValidated: point.validated })
    })
  })

  // console.log(pointArr)
  return pointArr
}

const washingCertificateCodes = [
  'C01',
  'C10',
  'C20',
  'E35',
  'E41',
  'E50',
  'E51',
  'E52',
  'E55',
  'E56',
  'E57',
  'E58',
  'E60',
  'E61',
  'E62',
  'E63',
  'E64',
  'E71',
  'E72',
  'E75',
  'E77',
  'E78',
  'E79',
  'E90',
  'F01',
  'F50',
  'P01',
  'P10',
  'P30',
  'P40',
  'W50'
]

const prohibitedCodes = ['C01', 'C10', 'C20', 'F51']

function handleValidationCheck() {
  if (!PoCValidationDone.value) {
    PoCValidationDone.value = true
    getProhibitedCodes()
    getValidationPoints()

    // console.log('ERRORS', errors.value)

    if (errors.value.length > 0) {
      errorMsg.value =
        'Se notaron algunas diferencias entre el documento y la validación. Por favor, revisar para evitar errores.'
    }
  } else handleClose()
}

function getProhibitedCodes() {
  let prohibitedPointsArray: any = []

  prohibitedCodes.forEach((code) => {
    const extractedProhibitedPoint = Object.keys(
      certificatePoCValidation.value!.extractedFields
    ).find((prohibitedCode) => prohibitedCode.includes(code))

    if (extractedProhibitedPoint) {
      const value = certificatePoCValidation.value?.extractedFields[extractedProhibitedPoint]
      prohibitedPointsArray.push({
        pocPoint: { extractedProhibitedPoint, value }
      })
    }
  })

  prohibitedPointsArray.forEach((prohibitedPoint: ProhibitedPoints) => {
    if (!prohibitedPoint.pocPoint.value) return
    else errors.value.push(prohibitedPoint.pocPoint.extractedProhibitedPoint)
  })
}

function getValidationPoints() {
  const validationPoints = getValidatedChecks()
  let validationPointsArray: any = []

  washingCertificateCodes.forEach((code) => {
    const validationPoint: ValidationPoint | undefined = validationPoints.find((point) =>
      point.title.includes(code)
    )
    const extractedFieldPoint = Object.keys(certificatePoCValidation.value!.extractedFields).find(
      (key) => key.includes(code)
    )

    if (validationPoint && extractedFieldPoint) {
      const value = certificatePoCValidation.value?.extractedFields[extractedFieldPoint]
      validationPointsArray.push({
        manualVal: validationPoint,
        pocPoint: { extractedFieldPoint, value }
      })
    }
  })

  validationPointsArray.forEach((points: AllPoints) => {
    if (points.pocPoint.value) {
      if (points.manualVal.isValidated) return
      else errors.value.push(points.manualVal.title)
    } else if (!points.pocPoint.value) {
      if (!points.manualVal.isValidated) return
      else errors.value.push(points.manualVal.title)
    }
  })
}
</script>

<style lang="scss" scoped>
.error-text {
  text-align: left;
  color: $c-error;
  font-weight: bold;
  font-size: 16px;
}
.page-wrapper {
  background-color: $c-grey-10;
  padding: 2rem 1rem;
  margin: 1rem 12rem;

  .document-detail {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
    height: calc(100vh - 12rem);
    min-width: calc(100vw - 30rem);
    overflow-y: auto;
    padding-bottom: 1rem;

    .image-wrapper {
      position: relative;
      width: 45%;

      .pdf-image {
        width: 100%;
        height: 45rem;
      }

      .zoom-image {
        cursor: zoom-in;
        position: absolute;
        overflow: hidden;
        background-size: 150%;

        & .static-image {
          transition: opacity 0.5s;
          width: 100%;
          &:hover {
            opacity: 0;
          }
        }
      }
    }

    .validation-wrapper {
      display: flex;
      flex-direction: column;
      width: 55%;
      margin-right: 1rem;
      padding-bottom: 1rem;

      .doc-number {
        display: flex;
        justify-content: space-between;
        h3 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }
      }

      .section-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 1rem;

        & .buttons {
          display: flex;
          align-items: center;
          justify-content: end;
          gap: 2rem;
          margin-top: 2rem;

          .button {
            cursor: pointer;
            width: 200px;
            height: 3rem;
            border: none;
            font-size: 16px;
            border-radius: 8px;
            padding: 0 1.2rem;
          }

          .button:first-child {
            background-color: $c-turquoise-invent;
            color: $c-turquoise-80;
          }

          .button:last-child {
            color: $c-white;
            background-color: $c-turquoise-80;
          }
        }

        .section-wrapper {
          text-align: left;
          display: flex;
          flex-direction: column;

          .section-title {
            font-size: 16px;
            line-height: 24px;
            margin-bottom: 12px;
          }

          .validation-list {
            background-color: $c-white;
            display: flex;
            flex-direction: column;
            padding: 1rem 1.5rem;

            .checkbox {
              margin: 0.5rem 1rem 0.5rem 0;
              text-align: left;
              line-height: 1.8;
              font-size: 16px;
            }
          }

          &:nth-child(1) {
            .validation-list {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
            }
          }
        }

        .prohibited-wrapper {
          text-align: left;

          ul {
            background-color: $c-white;
            display: flex;
            flex-direction: column;
            padding: 1rem 1.5rem;
            list-style: disc;

            .prohibited-code-item {
              margin: 0.3rem 0.7rem;
            }
          }
        }
      }

      .section-container:last-child {
        gap: 0.5rem;
      }

      .icon-close {
        cursor: pointer;
      }
    }
  }
}
</style>
