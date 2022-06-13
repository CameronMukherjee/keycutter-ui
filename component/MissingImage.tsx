import Image from 'next/image';

const MissingImage = () => {
  return (
      <div align={'center'} style={{height: 500, width: 500}}>
        <Image
            src={"/missing.svg"}
            width={500}
            height={500}
            layout={"responsive"}
            alt={"An image to illustrate that the table is missing."}/>
        <h1>No Data Found</h1>
      </div>
  )
}

export default MissingImage;