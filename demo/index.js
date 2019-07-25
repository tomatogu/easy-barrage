import Barrage from '../src/barrage'
import { barrageData } from './data'
import './index.css'

const el = document.getElementsByClassName('container')[0]

const barrage = new Barrage({
  container: el,
  data: barrageData,
  barrageItem: {
    height: 26
  },
  speed: 3,
  showAvatar: true
})

barrage.init()