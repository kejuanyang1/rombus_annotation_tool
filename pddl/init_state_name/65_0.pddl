(define (problem scene1)
  (:domain manip)
  (:objects
    white tape - item
    black pen - item
    USB drive - item
    screwdriver - item
    big screw - item
    pointed chisel - item
    pink basket - container
  )
  (:init
    (ontable white tape)
    (ontable black pen)
    (ontable USB drive)
    (ontable screwdriver)
    (ontable big screw)
    (ontable pointed chisel)
    (ontable pink basket)
    (clear white tape)
    (clear black pen)
    (clear USB drive)
    (clear screwdriver)
    (clear big screw)
    (clear pointed chisel)
    (clear pink basket)
    (handempty)
  )
  (:goal (and ))
)