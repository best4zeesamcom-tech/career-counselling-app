import { useState } from 'react';

function FAQ() {
  const [openId, setOpenId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "Is CareerGuide free to use?",
      answer: "Yes! CareerGuide offers free access to career paths, basic job listings, and the career quiz. Premium features are available for Rs. 4,500 one-time payment."
    },
    {
      id: 2,
      question: "What education levels do you cover?",
      answer: "We cover all major education levels in Pakistan: After Matric, After FSC (Pre-Medical, Pre-Engineering, ICS), and After University (Graduates)."
    },
    {
      id: 3,
      question: "How do I save jobs?",
      answer: "Simply create a free account, login, and click the 'Save Job' button on any job listing. Your saved jobs will appear in your profile."
    },
    {
      id: 4,
      question: "Can I upload my resume?",
      answer: "Absolutely! Once logged in, go to your Profile page and upload your resume in PDF or Word format."
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Got questions? We've got answers
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <span className="text-blue-600 text-xl">
                  {openId === faq.id ? '−' : '+'}
                </span>
              </button>
              {openId === faq.id && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;