import { createClient } from '@supabase/supabase-js';

// import dotenv from 'dotenv';

// dotenv.config();

const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL ;

 console.log(supabaseUrl)
 console.log(supabaseKey)
// Khởi tạo client Supabase

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function getConfigTable(){
  const { data, error } = await supabase.from('config').select('*');
  if(error){
    console.error('Error fetching data:', error.message)
    return
  }
  const urlImg = data[0].data.urlImg;
  const urlZalo = data[0].data.urlZalo;
  const result = {
    urlImg: urlImg,
    urlZalo: urlZalo
  }
  return (result);
}



async function getData() {
  const { data, error } = await supabase.from('post').select('*').order('created_at', { ascending: true  });
  if (error) {
    console.error('Error fetching data:', error.message)
    return
  }
  const dataAll = data.map((item: any) => {
    return {
      title: item.title,
      img_list: item.img_list.join(', ')
    };
  });
  // console.log(JSON.stringify(dataAll));
  return dataAll;
}


async function DataLoadImg() {
  var dataConfig = await getConfigTable();
  const urlImg = dataConfig?.urlImg;
  const urlZalo = dataConfig?.urlZalo;

  var dataAll = await getData();
  
  console.log(urlZalo);
  console.log(urlImg);

  if (urlImg && dataAll) {
    dataAll.forEach(item => {
      if (typeof item.img_list === 'string') {
        const imgListArray = item.img_list.split(',').map(img => `${urlImg}${img.trim()}`);
        item.img_list = imgListArray.join(', ');
      }
    });
  }
  console.log(dataAll);
  return { dataAll, urlImg, urlZalo };
}



export default DataLoadImg;


