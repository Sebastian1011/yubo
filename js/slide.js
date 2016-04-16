/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-10-18
 * Time: 下午4:03
 * To change this template use File | Settings | File Templates.
 */
function get(name, cursel, n) {

    for (var i = 1; i <= n; i++) {

        var menu = document.getElementById(name + i);
        var con = document.getElementById(name + "_" + i);

        if (i == cursel) {
            con.style.display = "block";
            menu.style.display="none";
        } else {
            con.style.display = "none";
            menu.style.display="block";
        }
    }
}