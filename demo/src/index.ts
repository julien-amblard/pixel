import { Pixelizer } from "../../src"
import "./core.scss"

const img = document.querySelector("img")

const test = Pixelizer(img, { machin: "truc" })
test.sayHello()
