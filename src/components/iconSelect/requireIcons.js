const iconArray=[]
const files = import.meta.glob("@/assets/svg/*.svg",{eager:true})
for (const key of Object.entries(files)) {
  let item =key[0]
  const lastIndex=item.lastIndexOf("\/")
  //svg图标名(带后缀svg)
  item=item.substring(lastIndex+1,item.length)
  //svg图标名字,剔除后缀.svg
  item=item.substring(0,item.lastIndexOf("\."))
  iconArray.push(item)
}
export default iconArray
