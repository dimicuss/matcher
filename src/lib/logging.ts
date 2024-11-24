import {inspect} from "util"

export const log = <T>(...objects: T[]) => {
  console.log(
    ...objects.map((obj) => inspect(obj, false, Infinity))
  )
}
