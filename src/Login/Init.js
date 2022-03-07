$("document").ready(function()
{
    $("#btn-create-account").click(function()
    {
        $("#registration-board").animate({right: '0'});
    });

    $("#btn-cancelar").click(function()
    {
        $("#registration-board").animate({right: '100vw'});
    });
});