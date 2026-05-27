type StudentInfoBlockProps = {
  classNameText?: string;
};

export const StudentInfoBlock = ({ classNameText }: StudentInfoBlockProps) => {
  const resolvedClassName = classNameText && classNameText !== 'N/A' ? classNameText : '______';

  return (
    <section className="grid w-full max-w-[420px] gap-[4px] font-button text-[16px] font-semibold leading-[160%] tracking-[-0.04em] text-text-primary sm:text-[18px]">
      <p>Name: ____________________</p>
      <p>Roll Number: ______________</p>
      <p>{`Class: ${resolvedClassName} Section: __________`}</p>
    </section>
  );
};
