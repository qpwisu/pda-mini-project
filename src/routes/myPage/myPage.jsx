// myPage.jsx
import MyTerm from '~/components/myPage/myTerm';
import MyNews from '~/components/myPage/myNews';



export default function MyPage() {
  return (
    <div style={{ padding: '30px 50px', backgroundColor: '#fffff' }}>
      {/* <h1>My Page</h1> */}
      <div style={{ marginBottom: '20px' }}>
        <MyTerm />
      </div>
      <MyNews />
    </div>
  );
}