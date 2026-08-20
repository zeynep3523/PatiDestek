using PatiDestekAPI.Enums;

namespace PatiDestekAPI.Helpers
{
    public static class EnumHelper
    {
        public static string GetCategoryName(ReportCategory category)
        {
            return category switch
            {
                ReportCategory.YaraliHayvan => "Yaralı Hayvan",
                ReportCategory.MamaIhtiyaci => "Mama İhtiyacı",
                ReportCategory.SuIhtiyaci => "Su İhtiyacı",
                ReportCategory.KayipHayvan => "Kayıp Hayvan",
                ReportCategory.Sahiplendirme => "Sahiplendirme",
                ReportCategory.GeciciYuva => "Geçici Yuva",
                ReportCategory.AcilKurtarma => "Acil Kurtarma",
                ReportCategory.OluHayvan => "Ölü Hayvan",
                ReportCategory.Diger => "Diğer",
                _ => category.ToString()
            };
        }
    }
}