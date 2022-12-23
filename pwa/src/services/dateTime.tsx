export const dateTime = (dateTime: string) => {
  if (!dateTime) {
    return;
  }
  var date = dateTime.split("T")[0];
  var timePlus = dateTime.split("T")[1];
  var time = timePlus.split("+")[0];
  return (
    <div>
      <a>{date}</a>
      <br />
      <a>{time}</a>
    </div>
  );
};
